import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ResponseBodyBuilder } from "../../../libs/ResponseUtil/ResponseBuilder.js";
import { logger } from "src/libs/Logger/Logger.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { TeamForm, TeamSchema, TeamTopForm } from "@scobit/types";
import { GameService } from "src/Service/GameService.js";
import { TeamService } from "src/Service/TeamService.js";
import { PlayerService } from "src/Service/PlayerService.js";

export const getTeam = async (event: APIGatewayProxyEventV2): Promise<ResponseBodyBuilder> => {
  logger.info(`チーム情報取得処理開始`);

  const param = event.queryStringParameters;
  const public_id = param?.public_id;
  logger.debug(`public_id : ${public_id}`);

  if (!public_id) {
    return ResponseUtil.error().addError('public_id', 'チームが存在しません。');
  }
  logger.info('バリデーションOK');

  const pool = await getPool().connect();

  try {
    const info: TeamForm = await TeamService.findTeamByPublicId(public_id, pool);
    logger.debugObj(info);
    if (!info) {
      return ResponseUtil.error().addError('public_id', 'チームが存在しません。')
    }
    logger.info('チーム情報取得');

    const games = await GameService.findGamesByTeamId(info.team_id, pool);
    const players = await PlayerService.findPlayersAbilittyByTeamId(info.team_id, pool);
    logger.info('情報取得完了');

    const result: TeamTopForm = {
      info, games, players
    }
    logger.debugObj(result)

    return ResponseUtil.success().putData('data', result);

  } catch (error) {
    console.error(error);
    return ResponseUtil.error().isServerError();
  } finally {
    pool.release();
  }


}


const schema = TeamSchema.pick({
  public_id: true
})

function validTeamId(public_id: string) {
  return schema.safeParse({ public_id }).success;
}