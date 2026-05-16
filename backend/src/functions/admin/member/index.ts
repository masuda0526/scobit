import { MemberForm, PlayerForm, PlayerFormSchema } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { JwtUtil } from "src/libs/JwtUtil/JwtUtil.js";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { convertToErrorInfos } from "src/libs/ZodUtil/ZodUtil.js";
import { PlayerService } from "src/Service/PlayerService.js";
import { ScoreService } from "src/Service/ScoreSercice.js";

const INIT_SCORE_COUNT = 10;

export const AdminMemberInit = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info('選手情報取得API');

  const payload = JwtUtil.checkJwtAndGetPayload(event);
  if(!payload){
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  logger.info('JWTチェックOK');

  if(!payload.team_id){
    return ResponseUtil.error().addError('team_id', 'チームIDがありません。');
  }
  logger.info(`チームIDチェックOK[${payload.team_id}]`)

  const body = event.body;
  if(!body){
    return ResponseUtil.error().addError('body', '必要な情報がありません。');
  }
  logger.info('ボディチェックOK');

  const playerId = JSON.parse(body).player_id;
  if(!playerId){
    return ResponseUtil.error().addError('player_id', '選手情報がありません。');
  }
  logger.info('選手IDチェックOK');

  const client = await getPool().connect();
  try {
    const info = await PlayerService.findPlayerAbilitty(payload.team_id, playerId, client)
    if(!info){
      return ResponseUtil.error().addError('player', '選手情報が存在しません。');
    }
    logger.info(`選手情報存在チェックOK [player_id=${info.player_id}]`);

    const scores = await ScoreService.findScoresByPlayerId(playerId, client, INIT_SCORE_COUNT);
    logger.info(`成績一覧取得完了。`);
    logger.debugObj(scores);

    const data:MemberForm = {info, scores};
    return ResponseUtil.success().putData('data', data);
    
  } catch (error) {
    console.error(error);
    return ResponseUtil.error().isServerError();
  }finally{
    client.release();
  }
}

export const updateMember = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info(`選手情報更新処理`);
  const payload = JwtUtil.checkJwtAndGetPayload(event);

  if(!payload.team_id){
    return ResponseUtil.error().addError('client', '必要な情報がありません。');
  }
  logger.info('JWT検証OK');

  const body = event.body;
  if(!body){
    return ResponseUtil.error().addError('body', '必要な情報がありません。');
  }
  logger.info('bodyチェックOK');

  const inputPlayer:PlayerForm = JSON.parse(body);
  const valid = PlayerFormSchema.safeParse(inputPlayer);
  if(!valid.success){
    return ResponseUtil.error().addErrors(convertToErrorInfos(valid.error));
  }
  logger.info(`バリデーションOK player_id:${inputPlayer.player_id}`);
  logger.debugObj(inputPlayer)

  const client = await getPool().connect();
  try {
    const player = await PlayerService.findPlayerByTeamIdAndPlayerId(payload.team_id, inputPlayer.player_id, client);
    if(!player){
      return ResponseUtil.error().addError('player', '選手情報が存在しません。');
    }
    logger.info('選手情報存在チェックOK');

    await client.query('BEGIN;');

    const updatedPlayer = await PlayerService.updatePlayer(inputPlayer, client);
    logger.info(`プレイヤー情報更新完了。`);
    logger.debugObj(updatedPlayer);

    await client.query('COMMIT;');

    return ResponseUtil.success().putData('player', updatedPlayer);

  } catch (error) {
    await client.query('ROLLBACK;');
    console.error(error);
    return ResponseUtil.error().isServerError();
  }finally{
    client.release()
  }

}