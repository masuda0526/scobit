import { MembersForm, TeamFormSchema, TeamSchema } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { findPlayersAbilittyByTeamId, PlayerService } from "src/Service/PlayerService.js";
import { TeamService } from "src/Service/TeamService.js";
import z from "zod";


export const membersPage = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info(`選手一覧画面表示処理開始`);

  const param = event.pathParameters;
  const public_id = param?.public_id;
  logger.debug(`public_id : ${public_id}`);

  if(!schema.safeParse({public_id}).success){
    return ResponseUtil.error().addError('public_id', 'チームが存在しません。');
  }
  logger.info('バリデーションOK');

  const pool = await getPool().connect();
  try {
    const info = await TeamService.findTeamByPublicId(public_id!, pool);
    logger.info(`チーム情報取得完了 team_id:${info.team_id} name:${info.team_name}`);
    if(!info){
      return ResponseUtil.error().addError('public_id', 'チームが存在しません。');
    }
    
    const members = await PlayerService.findPlayersAbilittyByTeamId(info.team_id, pool);
    logger.info(`メンバー情報取得完了。取得人数:${members.length}人[${members.map(m => m.disp_name).join(',')}]`);
    logger.debugObj(members);
    const result:MembersForm = {info, members};
  
    return ResponseUtil.success().putData('data', result);
    
  } catch (error) {
    console.error(error);
    return ResponseUtil.error().isServerError();
  }finally{
    pool.release();
  }
}

const schema = TeamSchema.pick({
  public_id:true
})

