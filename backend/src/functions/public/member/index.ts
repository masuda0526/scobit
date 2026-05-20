import { MemberForm, PlayerFormSchema, TeamFormSchema } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { PlayerService } from "src/Service/PlayerService.js";
import { ScoreService } from "src/Service/ScoreSercice.js";
import { TeamService } from "src/Service/TeamService.js";
import z from "zod";

export const memberPage = async (event: APIGatewayProxyEvent): Promise<ResponseBodyBuilder> => {
  logger.info(`選手詳細ページ取得処理開始`);
  const SCORE_SHOW_COUNT = 5;
  const param = event.pathParameters;
  const public_id = param?.public_id;
  const player_id = param?.player_id;

  if (!schema.safeParse({public_id, player_id}).success) {
    return ResponseUtil.error().addError('client', '選手情報の取得に失敗しました。');
  }
  logger.info('バリデーションOK');

  
  // 選手情報取得処理開始
  const pool = await getPool().connect();
  try {
    const team = await TeamService.findTeamByPublicId(public_id!, pool);
    if(!team){
      return ResponseUtil.error().addError('public_id', 'チーム情報が存在しません。');
    }
    logger.info('チーム情報取得完了');
    logger.debugObj(team);
  
    const [info, scores] = await Promise.all(
      [
        PlayerService.findPlayerAbilitty(team.team_id!, player_id!, pool),
        ScoreService.findScoresByPlayerId(player_id!, pool, SCORE_SHOW_COUNT)
      ]
    )
    logger.info('選手情報取得完了');
    
    const data:MemberForm = {info, scores};
    logger.debugObj(data);
  
    return ResponseUtil.success().putData('data', data);
    
  } catch (error) {

    console.error(error);
    return ResponseUtil.error().isServerError();
    
  } finally {
    pool.release();
  }
}

const schema = z.object({
  ...PlayerFormSchema.pick({ player_id: true }).shape,
  ...TeamFormSchema.pick({ public_id: true }).shape
})