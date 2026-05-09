import { Account, AccountsPlayers, NewAccountDto, NewAccountDtoSchema, Player } from "@scobit/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { hashSync } from "bcrypt";
import { Pool, PoolClient } from "pg";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { convertToErrorInfos } from "src/libs/ZodUtil/ZodUtil.js";
import { saveNewAccountPlayerLink } from "src/Service/AccountPlayerLinkService.js";
import { isDupulicateMail, isDupulicatePublicId, saveNewAccount } from "src/Service/AccountService.js";
import { saveNewPlayer } from "src/Service/PlayerService.js";

export const registAccount = async (event: APIGatewayProxyEvent): Promise<ResponseBodyBuilder> => {
  if (!event.body) {
    return ResponseUtil.error().addError('client', '不正なリクエストです。');
  }
  logger.info('ボディチェックOK');

  const dto: NewAccountDto = JSON.parse(event.body);
  logger.debug(`入力内容`);
  logger.debugObj(dto);

  const valid = NewAccountDtoSchema.safeParse(dto);
  if (!valid.success) {
    return ResponseUtil.error().addErrors(convertToErrorInfos(valid.error));
  }

  if (Number.isNaN(Number.parseInt(dto.throw_distance))) {
    return ResponseUtil.error().addError('throw_distance', '遠投距離(m)を確認してください。');
  }
  logger.info(`バリデーションOK（属性・桁数チェック）`);

  const pool = getPool();
  const checkDupulicate = await isDupulicatePublicId(dto.account_pub_id, pool);
  if (!checkDupulicate.isOk) {
    return ResponseUtil.error().addErrors([checkDupulicate.errorInfo]);
  }
  logger.info(`バリデーションOK（ユーザーID重複チェック）`);

  const checkMail = await isDupulicateMail(dto.email, pool);
  if(!checkMail.isOk){
    return ResponseUtil.error().addErrors([checkMail.errorInfo]);
  }
  logger.info(`バリデーションOK(メールアドレス重複チェック)`);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { account, player, account_player_link } = await registNewAccount(dto, client);

    await client.query('COMMIT');

  } catch (error) {
    console.log(error);
    await client.query('ROLLBACK');

    return ResponseUtil.error().addError('server', '予期せぬエラーが発生しました。再度登録してください。');
  } finally {
    client.release();
  }

  return ResponseUtil.success()

}


/**
 * 新規登録処理
 * @param dto 
 * @param client 
 * @returns 
 */
async function registNewAccount(dto: NewAccountDto, client: PoolClient) {
  const registDt = new Date();

  const account: Account = {
    account_id: crypto.randomUUID(),
    account_pub_id: dto.account_pub_id,
    email: dto.email,
    hash_pass: hashSync(dto.pass, 10),
    created_at: registDt,
    updated_at: registDt
  }
  await saveNewAccount(account, client);

  const player: Player = {
    player_id: crypto.randomUUID(),
    name: dto.name,
    disp_name: dto.disp_name,
    throw_distance: Number.parseInt(dto.throw_distance),
    positions: dto.positions,
    created_at: registDt,
    updated_at: registDt
  }
  await saveNewPlayer(player, client);

  const account_player_link: AccountsPlayers = {
    account_id: account.account_id,
    player_id: player.player_id
  };
  await saveNewAccountPlayerLink(account_player_link, client);

  logger.debug('登録内容');
  logger.debugObj({ account, player, account_player_link });

  return { account, player, account_player_link }
}