import { GameDetail } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { JwtUtil } from "src/libs/JwtUtil/JwtUtil.js";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { GameService } from "src/Service/GameService.js";
import { ScoreService } from "src/Service/ScoreSercice.js";
import z from "zod";

export const AdminGameInit = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info(`試合結果詳細ページ初期表示処理`);

  const payload = JwtUtil.checkJwtAndGetPayload(event);
  if(!payload.team_id){
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  logger.info('JWTチェックOK');

  const body = event.body;
  if(!body){
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  const {game_id} = JSON.parse(body);
  if(!game_id){
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }

  const valid = z.object({game_id:z.uuid()}).safeParse({game_id});
  if(!valid.success){
    return ResponseUtil.error().addError('team_id', 'チームIDを確認してください。');
  }

  const client = await getPool().connect();
  try {
    const game = await GameService.findGameByGameIdAndTeamId(payload.team_id, game_id, client);
    if(!game){
      return ResponseUtil.error().addError('game_id', '対象の試合結果が存在しません。');
    }
    logger.info(`試合結果存在チェックOK game_id:${game_id}`);
    logger.debugObj(game);

    const scores = await ScoreService.findScoresByGameId(game_id, client);
    logger.info(`成績一覧取得完了 ${scores.length}件`);
    logger.debugObj(scores);

    const data : GameDetail = {game, scores};

    return ResponseUtil.success().putData('data', data);

  } catch (error) {
    console.error(error);
    return ResponseUtil.error().isServerError();
  } finally {
    client.release();
  }
}