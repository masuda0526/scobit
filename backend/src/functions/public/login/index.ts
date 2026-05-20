import { APIGatewayProxyEvent } from "aws-lambda";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { convertToErrorInfos } from "src/libs/ZodUtil/ZodUtil.js";
import { AccountService } from "src/Service/AccountService.js";
import z from "zod";
import bcrypt from 'bcrypt';
import { JwtUtil } from "src/libs/JwtUtil/JwtUtil.js";


export const login = async (event:APIGatewayProxyEvent): Promise<ResponseBodyBuilder> => {

  logger.info(`ログイン処理開始`);
  const body = JSON.parse(event.body??'');
  if(!body){
    return ResponseUtil.error().addError('server', 'サーバーでエラーが発生しました。');
  }
  const {email, pass} = body;

  const valid = schema.safeParse({email, pass});
  if(!valid.success){
    return ResponseUtil.error().addErrors(convertToErrorInfos(valid.error));
  }
  logger.info('バリデーションOK');

  const pool = await getPool().connect();
  try {
    const accounts = await AccountService.findAccountByEmail(email, pool);
    if(accounts.length === 0){
      logger.info(`アカウント存在なし。[${email}]`);
      return ResponseUtil.error().addError('client', 'メールアドレスまたはパスワードに誤りがあります。');
    }
    logger.info(`アカウントの存在チェックOK　メールアドレス：${email}`)
    logger.debugObj(accounts)
  
    const account = accounts[0];
    if(!bcrypt.compareSync(pass, account.hash_pass)){
      return ResponseUtil.error().addError('client', 'メールアドレスまたはパスワードに誤りがあります。');    
    }
    logger.info(`パスワード一致。`);
  
    const token = JwtUtil.createAccessTokenBeforeSelectTeam(account.account_id);
  
    return ResponseUtil.success().putData('token', token);
    
  } catch (error) {

    console.error();
    return ResponseUtil.error().isServerError();

  } finally {
    pool.release();
  }

}

const schema = z.object({
  email:z.email(),
  pass:z.string().min(1)
})