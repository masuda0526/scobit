import { MemberGamesForm } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { JwtUtil } from "src/libs/JwtUtil/JwtUtil";
import { logger } from "src/libs/Logger/Logger";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil";
import { getPool } from "src/libs/SqlUtil/SqlUtil";
import { PlayerService } from "src/Service/PlayerService";
import { ScoreService } from "src/Service/ScoreSercice";


const INIT_SCORE_SHOW_COUNT = 10;

export const AdminScoresPerMember = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info('成績情報一覧取得API');

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

    const scores = await ScoreService.findScoresByPlayerId(playerId, client, INIT_SCORE_SHOW_COUNT);
    logger.info(`成績一覧取得完了。`);
    logger.debugObj(scores);

    const data:MemberGamesForm = {info, scores};
    return ResponseUtil.success().putData('data', data);
    
  } catch (error) {
    console.error(error);
    return ResponseUtil.error().isServerError();
  }finally{
    client.release();
  }
}