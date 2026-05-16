import { MembersForm, PlayerForm, PlayerFormSchema, TeamForm } from "@scobit/types";
import { APIGatewayEvent } from "aws-lambda";
import { PoolClient } from "pg";
import { JwtUtil } from "src/libs/JwtUtil/JwtUtil.js";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { convertToErrorInfos } from "src/libs/ZodUtil/ZodUtil.js";
import { PlayerService } from "src/Service/PlayerService.js";
import { PlayersTeamsLinkService } from "src/Service/PlayersTeamsLinkService.js";
import { TeamService } from "src/Service/TeamService.js";

export const AdminMembersInit = async (event:APIGatewayEvent):Promise<ResponseBodyBuilder> => {
  logger.info('選手一覧初期表示処理');

  const payload = JwtUtil.checkJwtAndGetPayload(event);
  logger.info('JWT検証完了');
  logger.debugObj(payload);

  if(!payload.team_id){
    return ResponseUtil.error().addError('team_id', 'チームが存在しません。');
  }
  logger.info('チームID検証OK');

  const client = await getPool().connect()
  try {
    const info = await TeamService.findTeamByTeamId(payload.team_id, client);
    logger.info('チーム情報取得完了');
    logger.debugObj(info);

    const members = await PlayerService.findPlayersAbilittyByTeamId(payload.team_id, client);
    logger.info('選手情報取得完了');
    logger.debugObj(members);

    const data:MembersForm = {info, members};

    return ResponseUtil.success().putData('data', data);
  } catch (error) {

    console.error(error);
    return ResponseUtil.error().isServerError();

  }finally{
    client.release()
  }
}


export const MembersAddMember = async (event:APIGatewayEvent):Promise<ResponseBodyBuilder> => {
  logger.info('新規選手追加');
  
  const payload = JwtUtil.checkJwtAndGetPayload(event);
  logger.info('JWT検証OK');

  if(!payload.team_id){
    return ResponseUtil.error().addError('team_id', 'チームが存在しません。').setRedirect(true).redirectTo('/login');
  }
  logger.info('チーム情報検証OK');

  const body = event.body;
  if(!body){
    return ResponseUtil.error().addError('client', 'リクエスト情報が不正です。');
  }
  const inputPlayer:PlayerForm = JSON.parse(body);
  
  const valid = PlayerFormSchema.safeParse(inputPlayer);
  if(!valid.success){
    logger.debugObj(valid.error);
    return ResponseUtil.error().addErrors(convertToErrorInfos(valid.error));
  }
  logger.info('バリデーションOK');

  const client = await getPool().connect();
  try {
    const team = await TeamService.findTeamByTeamId(payload.team_id, client);
    if(!team){
      return ResponseUtil.error().addError('team', 'チームが存在しません。');
    }
    logger.info('チーム存在チェックOK');
    logger.debugObj(team);

    await client.query('BEGIN;');

    const{registPlayerTeamLink, registPlayer} = await saveNewMember(inputPlayer, team, client);
    logger.info('登録完了');
    logger.debugObj({registPlayerTeamLink, registPlayer});

    await client.query('COMMIT;');

    const players = await PlayerService.findPlayersAbilittyByTeamId(team.team_id, client);
    logger.info('更新後のデータ取得完了');
    logger.debug(`選手の数：${players.length}`);
    logger.debugObj(players);

    return ResponseUtil.success().putData('players', players);

  } catch (error) {
    await client.query('ROLLBACK;')
    console.error(error);
    return ResponseUtil.error().isServerError();
  }finally{
    client.release();
  }

}

const saveNewMember = async (player:PlayerForm, team:TeamForm, client:PoolClient) => {
  const registPlayer = await PlayerService.saveNewPlayer(player, client);
  const registPlayerTeamLink = await PlayersTeamsLinkService.save(player.player_id, team.team_id, client);
  return {registPlayerTeamLink, registPlayer}
}