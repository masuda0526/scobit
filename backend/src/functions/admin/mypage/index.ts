import { MypageFormOfIndividualUser, ScoreItemDtoSchema, TeamFormSchema } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { JwtUtil } from "src/libs/JwtUtil/JwtUtil.js";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { convertToErrorInfos } from "src/libs/ZodUtil/ZodUtil.js";
import { AccountService } from "src/Service/AccountService.js";
import { PlayerService } from "src/Service/PlayerService.js";
import { ScoreService } from "src/Service/ScoreSercice.js";
import { findTeamsByAccountId, isExistTeam } from "src/Service/TeamService.js";
import z from "zod";

const INIT_SCORE_COUNT = 10;

export const mypageFetchTeams = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info('チーム情報取得処理開始')
  const payload = JwtUtil.checkJwtAndGetPayload(event);

  logger.info('JWT検証完了。');
  logger.debugObj(payload);

  const account_id = payload.sub;

  const client = await getPool().connect();
  try {
    const teams = await findTeamsByAccountId(account_id, client);
    logger.info('チーム情報取得完了。');
    logger.debugObj(teams);

    return ResponseUtil.success().putData('teams', teams);
    
  } catch (error) {
    console.log(error);
    return ResponseUtil.error().isServerError();
  }finally{
    client.release();  
  }

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
  try {
    const teams = await findTeamsByAccountId(payload.sub, client);
    const team = teams.find(team => team.team_id === team_id);
    
    logger.debugObj(teams);
    if(!team){
      return ResponseUtil.error().addError('team_id', '該当するチームが存在しません。');
    }
    const newToken = JwtUtil.createAccessTokenSelectTeam(payload.sub, team_id, team.role);
    logger.debug(`新しいトークン ${newToken}`);
    
    return ResponseUtil.success().putData('token', newToken);
  } catch (error) {
    console.error(error);
    return ResponseUtil.error().addError('server', '予期せぬエラーが発生しました。');
  }finally{
    client.release();
  }
}

export const mypageFetchKojinData = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info(`個人アカウントユーザー情報取得処理`);

  const payload = JwtUtil.checkJwtAndGetPayload(event);
  logger.info(`JWT検証完了。`)
  logger.debugObj(payload);

  const client = await getPool().connect();
  try {
    const teams = await findTeamsByAccountId(payload.sub, client);
    if(teams.length > 0){
      logger.info('個人アカウントチェックエラー');
      logger.debugObj(teams);
      return ResponseUtil.error().addError('account_id', 'チームアカウントです');
    }
  
    
    const [account, ability, scores] = await Promise.all([
      AccountService.findAccountFormByAccountId(payload.sub, client),
      PlayerService.findPlayerAbilityByAccountId(payload.sub, client),
      ScoreService.findScoresByAccountId(payload.sub, INIT_SCORE_COUNT, client)
    ])
    const dto:MypageFormOfIndividualUser = {account, ability, scores}
    logger.info(`マイページ表示用データ取得完了。`)
    logger.debugObj(dto);
  
    return ResponseUtil.success().putData('data', dto)
    
  } catch (error) {
    console.error(error);
    return ResponseUtil.error().addError('server', '予期しないエラーが発生しました。');
  }finally{
    client.release();
  }

}

const schema = z.object({
  ...TeamFormSchema.pick({team_id:true}).shape
})