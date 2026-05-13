import { GameDetail, GameFormSchema, TeamFormSchema } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { findGameByGameId } from "src/Service/GameService.js";
import { findScoresByGameId } from "src/Service/ScoreSercice.js";
import { TeamService } from "src/Service/TeamService.js";
import z from "zod";

export const gameDetailPage = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info('試合詳細情報取得処理開始');
  
  const param =event.pathParameters;
  const public_id = param?.public_id;
  const game_id = param?.game_id;
  logger.info(`public_id:${public_id} game_id:${game_id}`);

  if(!schema.safeParse({public_id, game_id}).success){
    return ResponseUtil.error().addError('client', '必要なパラメータが存在しません。');
  }
  logger.info('バリデーションOK');

  const pool = await getPool().connect();
  const team = await TeamService.findTeamByPublicId(public_id!, pool);
  if(!team){
    return ResponseUtil.error().addError('public_id', 'チーム情報が存在しません。');
  }
  logger.info(`チーム情報取得完了 team_id:${team.team_id} team_name:${team.team_name}`);

  const [game, scores] = await Promise.all([
    findGameByGameId(game_id!, pool),
    findScoresByGameId(game_id!, pool)
  ])

  if(!game){
    return ResponseUtil.error().addError('game_id', '該当する試合が存在しません。');
  }
  logger.info('試合情報取得完了');

  const data:GameDetail = {game, scores} ;
  logger.debugObj(data);

  return ResponseUtil.success().putData('data', data);
}

const schema = z.object({
  ...TeamFormSchema.pick({public_id:true}).shape,
  ...GameFormSchema.pick({game_id:true}).shape
})