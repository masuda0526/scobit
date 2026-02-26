import { ConditionalCheckFailedException, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UserRegist } from "../../types/index.js";
import { UserStatus } from "../../types/index.js";
import { hashPass } from "../../libs/PasswordUtil.js";
import { ExistBodyRequestChecker, ExistParamRequestChecker } from "../../libs/RequestUtil/RequestChecker.js";
import { ResponseBuilder } from "../../libs/ResponseUtil/ResponseBuilder.js";
import { SortKey } from "../../types/SortKeyConstants.js";
import { ValidationContext } from "../../libs/Validation/ValidationContext.js";
import { ValidationBuilder } from "../../libs/Validation/ValidationBuilder.js";
import { getDynamoDBDocumentClient } from "src/libs/DynamoDBUtil/DynamoDBUtil.js";
import { logger } from "src/libs/Logger/Logger.js";
import { NewTeamPageForm } from "@scobit/types";


const client = getDynamoDBDocumentClient();

export const handler = async (event:APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
    logger.info('チーム新規登録')
  try {
    // リクエストのチェック
    const reqCheck = new ExistBodyRequestChecker();
    // reqCheck.setNext(new ExistParamRequestChecker('userId', 'name', 'pass', 'email'));
    if(!reqCheck.check(event)){
      const resBuilder = new ResponseBuilder();
      resBuilder.error()
      resBuilder.addErrorMsg('system', "新規ユーザーの作成に失敗しました");
      return resBuilder.getProxyResponse()
    }
    logger.info('リクエストボディーチェックOK')

    const body = JSON.parse(event.body?event.body:'');
    const form:NewTeamPageForm = body;
    logger.debug('formデータ確認')
    logger.debug(JSON.stringify(form));

    const validContext = new ValidationContext();
    validContext.add(new ValidationBuilder(form.teamId, 'チームID', 'teamId').require().length(5, 20));
    validContext.add(new ValidationBuilder(form.leaderName, '代表者名', 'leaderName').require().length(1, 20));
    validContext.add(new ValidationBuilder(form.pass, 'パスワード', 'pass').require().length(8, 20));
    validContext.add(new ValidationBuilder(form.repass, '確認用パスワード', 'repass').require().length(8, 20));
    validContext.add(new ValidationBuilder(form.email, 'メールアドレス', 'email').require().length(1, 50).email());
    validContext.add(new ValidationBuilder(form.establishDt, '設立日', 'establishDt').require())
    validContext.add(new ValidationBuilder(form.teamName, 'チーム名', 'teamName').require().length(0, 20));

    if(!validContext.validate()){
      const resBuilder =  new ResponseBuilder();
      resBuilder.error();
      resBuilder.setErrorMsg(validContext.errorInfos);
      return resBuilder.getProxyResponse();
    }
    logger.debug('バリデーションOK');

    if(form.pass !== form.repass){
      const resBuilder = new ResponseBuilder();
      resBuilder.error();
      resBuilder.addErrorMsg('password', 'パスワードと確認用パスワードが一致しません。');
    }
    logger.debug('パスワードが一致しません。');
    
    const data = {
        pk:form.teamId,
        sk:`${form.teamId}@team_info`,
        ...form
    }
    
    const param : PutCommandInput = {
        TableName:process.env.DB_TABLE,
        Item:data,
        ConditionExpression:"attribute_not_exists(pk)"
    }
    
    await client.send(new PutCommand(param))
    logger.debug('新規データの登録に成功しました。');
    
    const resBuilder = new ResponseBuilder();
    resBuilder.ok();
    resBuilder.setFlashMsg('新規ユーザーの登録に成功しました。');

    return resBuilder.getProxyResponse()
    
  }catch(err){
    console.log(err);
    const resBuilder = new ResponseBuilder()
    if(err instanceof ConditionalCheckFailedException){
      resBuilder.addErrorMsg('userId', '入力されたユーザーIDは既に使用されています。');
    }else{
      resBuilder.addErrorMsg('system','サーバーでエラーが発生しました');
    }
    return {
      statusCode:500,
      body:JSON.stringify(resBuilder.getResponse())
    }
  }
}