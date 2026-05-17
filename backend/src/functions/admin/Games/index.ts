import { ScobitFunction } from "@scobit/common";
import { AdminGamesForms, GameForm, GameFormSchema } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { JwtUtil } from "src/libs/JwtUtil/JwtUtil.js";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { convertToErrorInfos } from "src/libs/ZodUtil/ZodUtil.js";
import { GameService } from "src/Service/GameService.js";
import { TeamService } from "src/Service/TeamService.js";
import { TournamentService } from "src/Service/TournamentService.js";

const INIT_GAME_COUNT = 10;

export const AdminGamesInit = async (event:APIGatewayProxyEvent) : Promise<ResponseBodyBuilder> => {
  logger.info('試合結果一覧初期情報取得処理')

  const payload = JwtUtil.checkJwtAndGetPayload(event);
  if(!payload.team_id){
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }

  const client = await getPool().connect();
  try {
    const team = await TeamService.findTeamByTeamId(payload.team_id, client);
    const tournaments = await TournamentService.findTournamentsByTeamId(payload.team_id, client);
    const games = await GameService.findGamesByTeamId(payload.team_id, client, INIT_GAME_COUNT);
    logger.info('初期表示情報取得完了');

    const data:AdminGamesForms = {team, tournaments, games};
    logger.debugObj(data);

    return ResponseUtil.success().putData('data', data);

  } catch (error) {
    console.error(error);
    return ResponseUtil.error().isServerError();
    
  }finally{
    client.release();
  }

}

export const AddNewGame = async (event:APIGatewayProxyEvent) : Promise<ResponseBodyBuilder> => {
  logger.info('試合結果新規追加処理');

  const payload = JwtUtil.checkJwtAndGetPayload(event);
  if(!payload.team_id){
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  logger.info('チーム情報存在チェックOK');

  const body = event.body;
  if(!body){
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  let inputGame:GameForm = JSON.parse(body);
  logger.info('ボディチェックOK');
  logger.debugObj(inputGame);

  const valid = GameFormSchema.safeParse(inputGame);
  if(!valid.success){
    return ResponseUtil.error().addErrors(convertToErrorInfos(valid.error));
  }
  inputGame = valid.data;
  logger.info('バリデーションOK');

  const result = ScobitFunction.getGameResult(inputGame.my_point, inputGame.op_point, inputGame.result === 'no-game');
  inputGame.result = result;

  const client = await getPool().connect();
  try {
    const team = await TeamService.findTeamByTeamId(payload.team_id, client);
    if(!team){
      return ResponseUtil.error().addError('team_id', 'チーム情報が存在しません。');
    }
    logger.info('チーム存在チェックOK');

    const tournament = await TournamentService.findTournamentByTeamIdandTournamentId(team.team_id, inputGame.tournament_id, client);
    if(!tournament){
      return ResponseUtil.error().addError('tournament_id', '試合タイプを確認してください。');
    }
    logger.info('試合タイプ存在チェックOK');
    logger.debugObj(tournament);

    // if(!DateUtil.between(inputGame.game_dt, tournament.start_dt, tournament.end_dt)){
    //   return ResponseUtil.error().addError('game_dt', '試合日時が大会期間外です。');
    // }
    logger.info('試合期間チェックOK');

    const isSameGameCheck = await GameService.checkExistSameGame(team.team_id, inputGame.game_dt, inputGame.seq,client);
    if(!isSameGameCheck){
      return ResponseUtil.error().addError('seq', '重複した試合が存在しています。試合順を確認してください。')
    }
    logger.info('試合順チェックOK');

    const updatedGame = await GameService.saveNewGame(team.team_id, tournament.tournament_id, inputGame, client);
    logger.info('新規登録完了。');
    logger.debugObj(updatedGame);

    const games = await GameService.findGamesByTeamId(team.team_id, client);
    logger.info(`変更後の試合結果一覧取得完了。 取得件数：${games.length}件`);
    logger.debugObj(games);

    return ResponseUtil.success().putData('games', games);
    
  } catch (error) {

    console.error(error);
    return ResponseUtil.error().isServerError();

  } finally {

    client.release();

  }


}


