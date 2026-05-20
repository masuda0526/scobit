import { GamesForm, TeamFormSchema } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { GameService } from "src/Service/GameService.js";
import { TeamService } from "src/Service/TeamService.js";
import z from "zod";

export const gamesPage = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info('試合結果一覧処理開始');

  const GAME_SHOW_LIMIT = 50;
  const param = event.pathParameters;
  const public_id = param?.public_id;
  logger.info(`public_id:${public_id}`);

  if(!schema.safeParse({public_id}).success){
    return ResponseUtil.error().addError('client', 'チーム情報が存在しません。');;
  }
  logger.info('バリデーションOK');
  
  const client = await getPool().connect();
  try {
    const team = await TeamService.findTeamByPublicId(public_id!, client);
  
    if(!team){
      return ResponseUtil.error().addError('public_id', '該当するチーム情報がありません。');
    }
    logger.info(`チーム情報の取得完了。 team_id:${team.team_id} team_name:${team.team_name}`);
    logger.debugObj(team);
  
    const games = await GameService.findGamesByTeamId(team.team_id, client, GAME_SHOW_LIMIT);
    logger.info(`試合結果一覧取得完了。（${games.length}試合）`)
    
    const data:GamesForm = {team, games};
    logger.debugObj(data);
  
    return ResponseUtil.success().putData('data', data);
    
  } catch (error) {
    console.error(error);
    return ResponseUtil.error().isServerError();
  }finally{
    client.release();
  }
}

const schema = z.object({
  ...TeamFormSchema.pick({public_id:true}).shape,
})