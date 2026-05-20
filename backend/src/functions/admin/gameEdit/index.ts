import { AdminGameEditForm, ErrorInfo, GameForm, GameFormSchema, PlayerForm, ScoreForm, ScoreFormSchema, ScoreValidationResult } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DateUtil } from "src/libs/DateUtil.js";
import { JwtUtil } from "src/libs/JwtUtil/JwtUtil.js";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { convertToErrorInfos } from "src/libs/ZodUtil/ZodUtil.js";
import { GameService } from "src/Service/GameService.js";
import { PlayerService } from "src/Service/PlayerService.js";
import { ScoreService } from "src/Service/ScoreSercice.js";
import { TournamentService } from "src/Service/TournamentService.js";

export const AdminGameEditInit = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {

  logger.info('試合成績編集画面API');

  const payload = JwtUtil.checkJwtAndGetPayload(event);
  if(!payload.team_id){
    return ResponseUtil.error().addError('client', 'リクエストが不正です。');
  }
  logger.info('JWTチェックOK');

  const body = event.body;
  if(!body){
    return ResponseUtil.error().addError('client', 'リクエストが不正です。');
  }
  logger.info(`ボディチェックOK`);

  const {game_id} = JSON.parse(body);
  if(!game_id){
    return ResponseUtil.error().addError('client', 'リクエストが不正です。');
  }
  logger.info(`ゲームIDチェックOK game_id:${game_id}`);

  const client = await getPool().connect();
  try {
    const game = await GameService.findGameByGameIdAndTeamId(payload.team_id, game_id, client);
    if(!game){
      return ResponseUtil.error().addError('game_id', '対象の試合結果が存在しません。');
    }
    logger.info('試合結果存在チェックOK');
    logger.debugObj(game);

    const tournaments = await TournamentService.findTournamentsByTeamId(payload.team_id, client);
    logger.info('試合タイプ情報取得完了');
    logger.debugObj(tournaments);

    const members = await PlayerService.findPlayersAbilittyByTeamId(payload.team_id, client);
    logger.info(`選手情報取得完了 取得件数:${members.length}件`);
    logger.debugObj(members);

    const scores = await ScoreService.findScoresByGameId(game_id, client);
    logger.info(`試合情報取得完了 取得件数:${scores.length}件`);
    // logger.debugObj(scores);

    const data:AdminGameEditForm = {game, tournaments, members, scores}
    return ResponseUtil.success().putData('data', data);
    
  } catch (error) {
    console.error(error);
    return ResponseUtil.error().isServerError();
  } finally {
    client.release();
  }

}

export const editGame = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info('試合成績編集画面（試合情報編集）API');

  const payload = JwtUtil.checkJwtAndGetPayload(event);
  if(!payload.team_id){
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  logger.info('JWTチェックOK');

  const body = event.body;
  if(!body){
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  logger.info('ボディチェックOK');

  const valid = GameFormSchema.safeParse(JSON.parse(body));
  if(!valid.success){
    return ResponseUtil.error().addErrors(convertToErrorInfos(valid.error));
  }
  const inputGame = valid.data;
  logger.info(`バリデーションOK`);
  logger.debugObj(inputGame);

  const client = await getPool().connect()
  try {
    const game = await GameService.findGameByGameIdAndTeamId(payload.team_id, inputGame.game_id, client);
    if(!game){
      return ResponseUtil.error().addError('game', '試合結果情報が存在しません。');
    }
    logger.info('試合結果存在チェックOK');

    const tournament = await TournamentService.findTournamentByTeamIdandTournamentId(payload.team_id, inputGame.tournament_id, client);
    if(!tournament){
      return ResponseUtil.error().addError('tournament_id', '試合タイプが存在しません。');
    }
    logger.info('試合タイプ存在チェックOK');

    if(!DateUtil.between(inputGame.game_dt, tournament.start_dt, tournament.end_dt)){
      return ResponseUtil.error().addError('game_dt', '試合日が大会期間外です。');
    }
    logger.info('試合期間チェックOK');

    await client.query('BEGIN;');

    const updatedGame = await GameService.updateGame(inputGame, payload.team_id, client);
    logger.info('試合結果更新完了。');
    logger.debugObj(updatedGame);
    
    await client.query('COMMIT;');

    return ResponseUtil.success().putData('data', updatedGame);

  } catch (error) {
    console.error(error);
    await client.query('ROLLBACK;')
    return ResponseUtil.error().isServerError();
  } finally {
    client.release();
  }
}

export const editScores = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info('成績編集処理API');

  const payload = JwtUtil.checkJwtAndGetPayload(event);
  if(!payload.team_id){
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  logger.info('JWTチェックOK');

  const body = event.body;
  if(!body){
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  logger.info('ボディチェックOK');

  const scores : ScoreForm[] = JSON.parse(body);
  if(!scores){
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }

  const client = await getPool().connect();
  try {
    const players = await PlayerService.findPlayersByTeamId(payload.team_id, client);
    logger.info(`選手情報取得完了 取得件数:`)

    const scoreErrors = validationScores(scores);
    if(scoreErrors.length > 0){
      logger.debugObj(scoreErrors);
      return ResponseUtil.error().putData('extErrors', scoreErrors);
    }
    logger.info('スコアバリデーションOK');

    if(!isExistPlayerCheck(players, scores)){
      return ResponseUtil.error().addError('players', '選手一覧を確認してください。');
    }
    logger.info(`選手存在チェックOK 選手数：${players.length}名 成績数：${scores.length}件`);

    const gameId = scores[0].game_id;
    if(!gameId){
      return ResponseUtil.error().addError('game_id', '試合情報が正しくありません。');
    }
    logger.info(`ゲームIDチェックOK game_id:${gameId}`);

    const game:GameForm = await GameService.findGameByGameIdAndTeamId(payload.team_id, gameId, client);
    if(!game){
      return ResponseUtil.error().addError('game', '入力された試合が存在していません。');
    }
    logger.info('試合存在チェックOK');
    logger.debugObj(game);

    await client.query('BEGIN;');

    const updatedScores = await ScoreService.updateScores(scores, gameId, client);
    logger.info(`成績の更新完了 更新件数:${updatedScores.length}`);
    logger.debugObj(updatedScores)

    await client.query('COMMIT;');

    return ResponseUtil.success().putData('updatedScores', updatedScores);
    
  } catch (error) {
    console.error(error);
    await client.query('ROLLBACK;')
    return ResponseUtil.error().isServerError();
  } finally {
    client.release();
  }

  
}

type ExtErrorInfo = {
  player_id:string,
  errors:ErrorInfo[]
}
function validationScores (scores:ScoreForm[]) {
  const extErrors:ExtErrorInfo[] = [];
  scores.forEach(score => {
    const valid = ScoreFormSchema.safeParse(score);
    if(!valid.success){
      extErrors.push({player_id:score.player_id, errors:convertToErrorInfos(valid.error)});
    }
  })
  return extErrors
}

function isExistPlayerCheck(players:PlayerForm[], scores:ScoreForm[]):boolean{
  scores.forEach(score => {
    if(!players.find(player => player.player_id === score.player_id)){
      return false;
    }
  })
  return true;
}