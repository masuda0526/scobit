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


const client = DynamoDBDocumentClient.from(new DynamoDBClient({region:'ap-northeast-1'}));

export const createNewUser = async (event:APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
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

    const body = JSON.parse(event.body?event.body:'');
    const {userId, name, pass, repass, email} = body;

    const validContext = new ValidationContext();
    validContext.add(new ValidationBuilder(userId, 'ユーザーID', 'userId').require().length(5, 20));
    validContext.add(new ValidationBuilder(name, 'ユーザー名', 'name').require().length(1, 20));
    validContext.add(new ValidationBuilder(pass, 'パスワード', 'pass').require().length(8, 20));
    validContext.add(new ValidationBuilder(repass, '確認用パスワード', 'repass').require().length(8, 20));
    validContext.add(new ValidationBuilder(email, 'メールアドレス', 'email').require().length(1, 50).email());

    if(!validContext.validate()){
      const resBuilder =  new ResponseBuilder();
      resBuilder.error();
      resBuilder.setErrorMsg(validContext.errorInfos);
      return resBuilder.getProxyResponse();
    }

    if(pass !== repass){
      const resBuilder = new ResponseBuilder();
      resBuilder.error();
      resBuilder.addErrorMsg('password', 'パスワードと確認用パスワードが一致しません。');
    }

    const data:UserRegist = {
      pk:userId,
      sk:`${userId}@${SortKey.USER_INFO}`,
      name:name,
      passHash:hashPass(pass),
      email:email,
      status:UserStatus.ACTIVE
    }

    const param : PutCommandInput = {
      TableName:'gantule',
      Item:data,
      ConditionExpression:"attribute_not_exists(pk)"
    }

    await client.send(new PutCommand(param))

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