import { TeamForm, TeamFormSchema, TeamTopForm } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { JwtUtil } from "src/libs/JwtUtil/JwtUtil.js";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { convertToErrorInfos } from "src/libs/ZodUtil/ZodUtil.js";
import { GameService } from "src/Service/GameService.js";
import { PlayerService } from "src/Service/PlayerService.js";
import { TeamService } from "src/Service/TeamService.js";


export const AdminTeamInit = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info(`マイページ初期情報取得処理`)
  
  const payload = JwtUtil.checkJwtAndGetPayload(event);
  logger.debugObj(payload);

  if(!payload.team_id){
    logger.debug('チーム情報なし');
    return ResponseUtil.error().addError('team_id', 'チーム情報がありません。');
  }

  const client = await getPool().connect();
  try {
    const [info, games, players] = await Promise.all([
      TeamService.findTeamByTeamId(payload.team_id, client),
      GameService.findGamesByTeamId(payload.team_id, client, 5),
      PlayerService.findPlayersAbilittyByTeamId(payload.team_id, client)
    ])

    const data:TeamTopForm = {info, games, players};

    return ResponseUtil.success().putData('data', data);
    
  } catch (error) {
    console.error(error);
    return ResponseUtil.error().isServerError();

  }finally{
    client.release();
  }
}

export const updateTeamInfo = async (event:APIGatewayProxyEvent) : Promise<ResponseBodyBuilder> => {
  logger.info('チーム情報更新処理');

  const payload = JwtUtil.checkJwtAndGetPayload(event);
  logger.info('JWT検証完了');

  if(!event.body){
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  const body = JSON.parse(event.body);
  const inputTeam:TeamForm = body
  logger.info('ボディ検証完了');
  logger.debugObj(inputTeam);

  const valid = TeamFormSchema.safeParse(inputTeam);
  if(!valid.success){
    return ResponseUtil.error().addErrors(convertToErrorInfos(valid.error));
  }
  logger.info('バリデーションOK');

  const client = await getPool().connect();
  try {
    const teams = await TeamService.findTeamsByAccountId(payload.sub, client);
    const team = teams.find(team => team.team_id === payload.team_id);
    if(!team){
      return ResponseUtil.error().addError('team', 'チームが存在しません。');
    }
    const updatedTeam = await TeamService.saveTeamForm(inputTeam, client);
    logger.info('DB更新成功。');
    logger.debugObj(updatedTeam);
    
    return ResponseUtil.success().putData('updatedTeam', updatedTeam);
    
  } catch (error) {
    console.error(error);
    return ResponseUtil.error().isServerError();
  }finally{
    client.release()
  }
}