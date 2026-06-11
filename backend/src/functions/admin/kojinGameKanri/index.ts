import { ScobitFunction } from "@scobit/common";
import { ErrorInfo, GameFormSchema, ScoreFormSchema } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DateUtil } from "src/libs/DateUtil";
import { JwtUtil } from "src/libs/JwtUtil/JwtUtil";
import { logger } from "src/libs/Logger/Logger";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil";
import { getPool } from "src/libs/SqlUtil/SqlUtil";
import { convertToErrorInfos } from "src/libs/ZodUtil/ZodUtil";
import { GameService } from "src/Service/GameService";
import { PlayerService } from "src/Service/PlayerService";
import { ScoreService } from "src/Service/ScoreSercice";
import { TournamentService } from "src/Service/TournamentService";

export const kojinAccountRegistGameInit = async (event: APIGatewayProxyEvent): Promise<ResponseBodyBuilder> => {
  logger.info('個人アカウント試合結果登録画面初期表示API');

  const payload = JwtUtil.checkJwtAndGetPayload(event);
  if (!payload.sub) {
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  logger.info('JWTチェックOK');

  
  const client = await getPool().connect();
  try {
    const tournaments = await TournamentService.findTournamentsByTeamId(payload.sub, client);
    
    const body = event.body;
    const {gameId} = JSON.parse(body??'');
    if(!gameId){
      return ResponseUtil.success().putData('tournaments',tournaments);
    }
    const game = await GameService.findGameByGameIdAndTeamId(payload.sub, gameId, client);
    if(!game){
      return ResponseUtil.error().addError('game', 'ゲーム情報がありません。')
    }

    const scores = await ScoreService.findScoresByGameId(game.game_id, client);

    return ResponseUtil.success().putData('tournaments', tournaments).putData('game', game).putData('score', scores[0]);
    
  } catch (error) {
    console.error(error);
    await client.query('ROLLBACK;')
    return ResponseUtil.error().isServerError();
  }finally{
    client.release();
  }
}

export const registNewGameForKojin = async (event: APIGatewayProxyEvent): Promise<ResponseBodyBuilder> => {

  logger.info('個人アカウント試合結果・成績新規登録API');

  const payload = JwtUtil.checkJwtAndGetPayload(event);
  if (!payload.sub) {
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  logger.info('JWTチェックOK');

  const body = event.body;
  logger.debugObj(event);
  if (!body) {
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  logger.info('ボディチェックOK');

  const { game, score } = JSON.parse(body);
  const gameValid = GameFormSchema.safeParse(game);
  const scoreValid = ScoreFormSchema.safeParse(score);
  let errors: ErrorInfo[] = [];
  if (!gameValid.success) {
    errors = [...errors, ...convertToErrorInfos(gameValid.error)];
  }
  if (!scoreValid.success) {
    errors = [...errors, ...convertToErrorInfos(scoreValid.error)];
  }
  if (errors.length > 0) {
    return ResponseUtil.error().addErrors(errors);
  }
  const inputGame = gameValid.data;
  const inputScore = scoreValid.data;
  if (!inputGame) {
    return ResponseUtil.error().addError('game', '試合結果が存在しません。');
  }
  if (!inputScore) {
    return ResponseUtil.error().addError('score', '成績情報が存在しません。');
  }
  errors.push(...ScobitFunction.validScore(inputScore));
  if(errors.length>0){
    return ResponseUtil.error().addErrors(errors);
  }

  logger.info(`バリデーションOK`);
  logger.debugObj(inputGame);
  logger.debugObj(inputScore);

  inputGame.result = ScobitFunction.getGameResult(inputGame.my_point, inputGame.op_point);

  const client = await getPool().connect()
  try {
    logger.debug('試合結果情報バリデーション');
    errors.push(...await ScobitFunction.validGame(inputGame, payload.sub, client));
    if(errors.length > 0){
      return ResponseUtil.error().addErrors(errors);
    }
    const player = await PlayerService.findPlayerByAccountId(payload.sub, client);
    if (!player) {
      return ResponseUtil.error().addError('player', 'アカウント情報が不正です。');
    }
    inputScore.player_id = player.player_id;

    const tournament = await TournamentService.findTournamentByTeamIdandTournamentId(payload.sub, inputGame.tournament_id, client);
    if (!tournament) {
      return ResponseUtil.error().addError('tournament_id', '試合タイプが存在しません。');
    }
    logger.info('試合タイプ存在チェックOK');

    if (!DateUtil.between(inputGame.game_dt, tournament.start_dt, tournament.end_dt)) {
      return ResponseUtil.error().addError('game_dt', '試合日が大会期間外です。');
    }
    logger.info('試合期間チェックOK');

    await client.query('BEGIN;');

    const registedGame = await GameService.saveNewGame(payload.sub, inputGame.tournament_id, inputGame, client);
    inputScore.game_id = registedGame.game_id;
    logger.info('試合結果登録完了。');
    logger.debugObj(registedGame);

    const registedScore = await ScoreService.saveScore(inputScore, registedGame.game_id, client);
    logger.info('成績情報登録完了');
    logger.debugObj(registedScore);

    await client.query('COMMIT;');

    return ResponseUtil.success();

  } catch (error) {
    console.error(error);
    await client.query('ROLLBACK;')
    return ResponseUtil.error().isServerError();
  } finally {
    client.release();
  }
}

export const updateGameForKojinAccount = async (event: APIGatewayProxyEvent): Promise<ResponseBodyBuilder> => {

  logger.info('個人アカウント試合結果・成績更新API');

  const payload = JwtUtil.checkJwtAndGetPayload(event);
  if (!payload.sub) {
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  logger.info('JWTチェックOK');

  const body = event.body;
  logger.debugObj(event);
  if (!body) {
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  logger.info('ボディチェックOK');

  const { game, score } = JSON.parse(body);
  const gameValid = GameFormSchema.safeParse(game);
  const scoreValid = ScoreFormSchema.safeParse(score);
  let errors: ErrorInfo[] = [];
  if (!gameValid.success) {
    errors = [...errors, ...convertToErrorInfos(gameValid.error)];
  }
  if (!scoreValid.success) {
    errors = [...errors, ...convertToErrorInfos(scoreValid.error)];
  }
  if (errors.length > 0) {
    return ResponseUtil.error().addErrors(errors);
  }
  const inputGame = gameValid.data;
  const inputScore = scoreValid.data;
  if (!inputGame) {
    return ResponseUtil.error().addError('game', '試合結果が存在しません。');
  }
  if (!inputScore) {
    return ResponseUtil.error().addError('score', '成績情報が存在しません。');
  }
  errors.push(...ScobitFunction.validScore(inputScore));
  if(errors.length>0){
    return ResponseUtil.error().addErrors(errors);
  }

  logger.info(`バリデーションOK`);
  logger.debugObj(inputGame);
  logger.debugObj(inputScore);

  inputGame.result = ScobitFunction.getGameResult(inputGame.my_point, inputGame.op_point);

  const client = await getPool().connect()
  try {
    logger.debug('試合結果情報バリデーション');
    const player = await PlayerService.findPlayerByAccountId(payload.sub, client);
    if (!player) {
      return ResponseUtil.error().addError('player', 'アカウント情報が不正です。');
    }
    inputScore.player_id = player.player_id;

    const dupGameCount = await ScoreService.duplicateGameTeamOrAccountId(payload.sub, inputGame, inputScore, client);
    if(dupGameCount > 0){
      return ResponseUtil.error().addError('seq', '試合順が重複しています。');
    }

    const tournament = await TournamentService.findTournamentByTeamIdandTournamentId(payload.sub, inputGame.tournament_id, client);
    if (!tournament) {
      return ResponseUtil.error().addError('tournament_id', '試合タイプが存在しません。');
    }
    logger.info('試合タイプ存在チェックOK');

    if (!DateUtil.between(inputGame.game_dt, tournament.start_dt, tournament.end_dt)) {
      return ResponseUtil.error().addError('game_dt', '試合日が大会期間外です。');
    }
    logger.info('試合期間チェックOK');

    await client.query('BEGIN;');

    const registedGame = await GameService.updateGame(inputGame, payload.sub, client);
    inputScore.game_id = registedGame.game_id;
    logger.info('試合結果更新完了。');
    logger.debugObj(registedGame);

    const registedScore = await ScoreService.updateScoreForKojinAccount(inputScore, client);
    logger.info('成績情報更新完了');
    logger.debugObj(registedScore);

    await client.query('COMMIT;');

    return ResponseUtil.success();

  } catch (error) {
    console.error(error);
    await client.query('ROLLBACK;')
    return ResponseUtil.error().isServerError();
  } finally {
    client.release();
  }

  

}