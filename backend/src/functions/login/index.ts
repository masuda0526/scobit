import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { ExistBodyRequestChecker } from "../../libs/RequestUtil/RequestChecker.js";
import { ResponseBuilder } from "../../libs/ResponseUtil/ResponseBuilder.js";
import { ValidationContext } from "../../libs/Validation/ValidationContext.js";
import { ValidationBuilder } from "../../libs/Validation/ValidationBuilder.js";
import { DynamoDBDocumentClient, GetCommand, GetCommandInput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { hashPass } from "../../libs/PasswordUtil.js";
import jwt from 'jsonwebtoken';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'ap-northeast-1' }))
const tableName = 'gantule'

export const login = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log('login()処理開始');
  // console.dir(event);
  try {
    const rc = new ExistBodyRequestChecker();
    if (!rc.check(event)) {
      const rb = new ResponseBuilder();
      rb.error()
      rb.addErrorMsg('server', '認証情報を入力してください。');
      return rb.getProxyResponse();
    }
    console.log('リクエストボディチェックOK');
    const body = JSON.parse(event.body ?? '')
    console.dir(body);
    const { userId, password } = body

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
    console.log('バリデーションOK');

    console.log('データの取得開始');
    const param: GetCommandInput = {
      TableName: tableName,
      Key: {
        pk: userId,
        sk: `${userId}@user_info`
      }
    }

    const result = await client.send(new GetCommand(param));
    console.log('取得結果');
    console.dir(result);
    if (!result.Item) {
      const rb = new ResponseBuilder();
      rb.error();
      rb.addErrorMsg('server', 'ユーザーIDまたはパスワードが一致しません。');
      return rb.getProxyResponse();
    }
    console.log('データの存在チェックOK');

    const passHash = hashPass(password);
    if (result.Item.passHash !== passHash) {
      const rb = new ResponseBuilder();
      rb.error();
      rb.addErrorMsg('server', 'ユーザーIDまたはパスワードが一致しません。');
      return rb.getProxyResponse();
    }
    console.log('パスワード認証OK');

    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET_KEY!, {
      expiresIn: '30m',
      algorithm: 'HS256',
      issuer:'gantule-api',
      audience:'gantule-client'
    });
    console.log(`生成したトークン:${token}`)

    const rb = new ResponseBuilder();
    rb.ok();
    rb.putData('token', token);
    rb.putData('userId', userId);
    return rb.getProxyResponse();

  } catch (error) {
    const rb = new ResponseBuilder();
    rb.error();
    rb.addErrorMsg('server', 'サーバーでエラーが発生しました。');
    return rb.getProxyResponse()
  }


}