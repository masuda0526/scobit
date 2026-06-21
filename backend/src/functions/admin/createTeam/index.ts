import { TeamFormSchema } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { JwtUtil } from "src/libs/JwtUtil/JwtUtil";
import { logger } from "src/libs/Logger/Logger";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil";
import { getPool } from "src/libs/SqlUtil/SqlUtil";
import { convertToErrorInfos } from "src/libs/ZodUtil/ZodUtil";
import { GameService } from "src/Service/GameService";
import { PlayerService } from "src/Service/PlayerService";
import { PlayersTeamsLinkService } from "src/Service/PlayersTeamsLinkService";
import { TeamService } from "src/Service/TeamService";
import { TournamentService } from "src/Service/TournamentService";

export const AdminCreateNewTeam = async (event:APIGatewayProxyEvent):Promise<ResponseBodyBuilder> => {
  logger.info('新規チーム作成処理開始');
  const payload = JwtUtil.checkJwtAndGetPayload(event);

  const body = event.body;
  if(!body) {
    return ResponseUtil.error().addError('client', 'ボディーがありません。');
  }
  logger.info('ボディチェックOK');

  const team = JSON.parse(body)
  const valid = TeamFormSchema.safeParse(team);
  if(!valid.success){
    return ResponseUtil.error().addErrors(convertToErrorInfos(valid.error));
  }
  const inputTeam = valid.data;
  logger.info('バリデーションOK');
  logger.debugObj(inputTeam);

  const client = await getPool().connect();
  try{
    const player = await PlayerService.findPlayerByAccountId(payload.sub, client);
    if(!player){
      return ResponseUtil.error().addError('player', 'アカウントに紐づくチーム情報が存在しません。');
    }
    logger.info('プレイヤー存在チェックOK');

    // 登録処理
    await client.query('BEGIN; ');

    const createdTeam = await TeamService.createTeam(inputTeam, client);
    logger.info('新規チーム登録完了');
    logger.debugObj(createdTeam);

    await PlayersTeamsLinkService.save(player.player_id, createdTeam.team_id, client);
    logger.info('プレイヤー・チーム関連テーブル登録完了');

    await TournamentService.registDefaultTournament(createdTeam.team_id, client);
    logger.info('大会情報登録完了');

    await GameService.overwriteAccountIdToTeamId(payload.sub, createdTeam.team_id, client);
    logger.info('アカウントID->チームID更新完了');

    await client.query('COMMIT ;');

    return ResponseUtil.success().putData('teams', createdTeam).addFlash('チーム登録完了しました。');

  }catch(error){
    await client.query('ROLLBACK ; ');
    console.error(error);
    return ResponseUtil.error().isServerError()
  }finally{
    client.release();
  }

}