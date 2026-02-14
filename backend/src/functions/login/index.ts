import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { ExistBodyRequestChecker } from "../../libs/RequestUtil/RequestChecker.js";
import { ResponseBuilder } from "../../libs/ResponseUtil/ResponseBuilder.js";
import { ValidationContext } from "../../libs/Validation/ValidationContext.js";
import { ValidationBuilder } from "../../libs/Validation/ValidationBuilder.js";
import { GetCommand, GetCommandInput } from "@aws-sdk/lib-dynamodb";
import { hashPass } from "../../libs/PasswordUtil.js";
import jwt from 'jsonwebtoken';
import { logger } from "../../libs/Logger/Logger.js";
import { getDynamoDBDocumentClient } from "src/libs/DynamoDBUtil/DynamoDBUtil.js";

const client = getDynamoDBDocumentClient();
const tableName = process.env.DB_TABLE

export const login = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  logger.info('ログイン処理開始')
  logger.debug(`DB_TABLE:${process.env.DB_TABLE}`)
  try {
    const rc = new ExistBodyRequestChecker();
    if (!rc.check(event)) {
      const rb = new ResponseBuilder();
      rb.error()
      rb.addErrorMsg('server', '認証情報を入力してください。');
      return rb.getProxyResponse();
    }
    logger.info('リクエストボディチェックOK');
    const body = JSON.parse(event.body ?? '')
    const { userId, password } = body
    logger.debug(`userID:${userId}`)
    logger.debug(`password:${password}`)

    // バリデーション
    const v = new ValidationContext();
    v.add(new ValidationBuilder(userId, 'ユーザーID', 'userId').require())
    v.add(new ValidationBuilder(password, 'パスワード', 'password').require());

    if (!v.validate()) {
      const rb = new ResponseBuilder();
      rb.error()
      rb.setErrorMsg(v.errorInfos);
      return rb.getProxyResponse();
    }
    logger.info('バリデーションOK');

    logger.info('データの取得開始');
    const param: GetCommandInput = {
      TableName: tableName,
      Key: {
        pk: userId,
        sk: `${userId}@user_info`
      }
    }

    const result = await client.send(new GetCommand(param));
    logger.info('取得結果');
    console.dir(result);
    if (!result.Item) {
      const rb = new ResponseBuilder();
      rb.error();
      rb.addErrorMsg('server', 'ユーザーIDまたはパスワードが一致しません。');
      return rb.getProxyResponse();
    }
    logger.info('データの存在チェックOK');

    const passHash = hashPass(password);
    logger.debug(passHash)
    if (result.Item.passHash !== passHash) {
      const rb = new ResponseBuilder();
      rb.error();
      rb.addErrorMsg('server', 'ユーザーIDまたはパスワードが一致しません。');
      return rb.getProxyResponse();
    }
    logger.info('パスワード認証OK');

    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET_KEY!, {
      expiresIn: '30m',
      algorithm: 'HS256',
      issuer:'gantule-api',
      audience:'gantule-client'
    });
    logger.info(`生成したトークン:${token}`)

    const rb = new ResponseBuilder();
    rb.ok();
    rb.putData('token', token);
    rb.putData('userId', userId);
    return rb.getProxyResponse();

  } catch (error) {
    logger.info("例外発生");
    console.error(error);   // ←これ最重要
    const rb = new ResponseBuilder();
    rb.error();
    rb.addErrorMsg('server', 'サーバーでエラーが発生しました。');
    return rb.getProxyResponse()
  }


}