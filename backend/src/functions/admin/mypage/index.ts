import { TeamFormSchema } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { JwtUtil } from "src/libs/JwtUtil/JwtUtil.js";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { convertToErrorInfos } from "src/libs/ZodUtil/ZodUtil.js";
import { findTeamsByAccountId, isExistTeam } from "src/Service/TeamService.js";
import z from "zod";

export const mypageFetchTeams = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info('チーム情報取得処理開始')
  const payload = JwtUtil.checkJwtAndGetPayload(event);

  logger.info('JWT検証完了。');
  logger.debugObj(payload);

  const account_id = payload.sub;

  const client = await getPool().connect();
  const teams = await findTeamsByAccountId(account_id, client);
  logger.info('チーム情報取得完了。');
  logger.debugObj(teams);
  client.release();  

  return ResponseUtil.success().putData('teams', teams);
}

export const mypageSelectTeam = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info('チーム選択処理開始。');
  const payload = JwtUtil.checkJwtAndGetPayload(event);

  logger.info('JWT検証完了。');
  logger.debugObj(payload);
  
  const body = JSON.parse(event.body??'');

  const valid = schema.safeParse(body);
  if(!valid.success){
    return ResponseUtil.error().addErrors(convertToErrorInfos(valid.error));
  }

  const team_id:string = body.team_id; 
  const client = await getPool().connect();
  const teams = await findTeamsByAccountId(payload.sub, client);
  const team = teams.find(team => team.team_id === team_id);
  logger.debugObj(teams);
  if(!team){
    return ResponseUtil.error().addError('team_id', '該当するチームが存在しません。');
  }
  client.release();
  
  const newToken = JwtUtil.createAccessTokenSelectTeam(payload.sub, team_id, team.role);
  logger.debug(`新しいトークン ${newToken}`);
  
  return ResponseUtil.success().putData('token', newToken);

}

const schema = z.object({
  ...TeamFormSchema.pick({team_id:true}).shape
})