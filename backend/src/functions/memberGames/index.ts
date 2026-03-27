import { MemberGamesForm, PlayerFormSchema, TeamFormSchema } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { findPlayerAbilitty, findPlayersAbilittyByTeamId } from "src/Service/PlayerService.js";
import { findScoresByPlayerId } from "src/Service/ScoreSercice.js";
import { findTeamByPublicId } from "src/Service/TeamService.js";
import z from "zod";

export const memberGamesPage = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info('選手試合成績一覧処理開始');

  const SCORE_GET_LIMIT = 50;
  const param = event.pathParameters;
  const public_id = param?.public_id;
  const player_id = param?.player_id;
  logger.info(`public_id:${public_id} player_id:${player_id}`);

  if(!schema.safeParse({public_id, player_id}).success){
    return ResponseUtil.error().addError('client', '成績情報がありません。');
  }
  logger.info('バリデーションOK');

  const pool = getPool();
  const team = await findTeamByPublicId(public_id!, pool)

  if(!team){
    return ResponseUtil.error().addError('public_id', '該当するチーム情報がありません。');
  }
  logger.info(`チーム情報の取得完了。 team_id:${team.team_id} team_name:${team.team_name}`);
  logger.debugObj(team);

  const [info, scores] = await Promise.all(
    [
      findPlayerAbilitty(team.team_id, player_id!, pool),
      findScoresByPlayerId(player_id!, pool, SCORE_GET_LIMIT)
    ]
  )
  if(!info){
    return ResponseUtil.error().addError('player_id', '該当する選手情報がありません。');
  }
  logger.info(`選手情報、成績一覧取得完了 選手名:${info.disp_name} 取得した成績数:${scores.length}試合`);
  
  const data:MemberGamesForm = {info, scores};
  logger.debugObj(data);

  return ResponseUtil.success().putData('data', data);
}

const schema = z.object({
  ...TeamFormSchema.pick({public_id:true}).shape,
  ...PlayerFormSchema.pick({player_id:true}).shape
})