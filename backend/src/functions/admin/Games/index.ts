import { AdminGamesForms } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { event } from "local/events/newTeamEvent.js";
import { JwtUtil } from "src/libs/JwtUtil/JwtUtil.js";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
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