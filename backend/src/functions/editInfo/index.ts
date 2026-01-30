import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ExistBodyRequestChecker } from "../../libs/RequestUtil/RequestChecker.js";
import { ResponseBuilder } from "../../libs/ResponseUtil/ResponseBuilder.js";
import { ValidationContext } from "../../libs/Validation/ValidationContext.js";
import { ValidationBuilder } from "../../libs/Validation/ValidationBuilder.js";
import { ProjectFI } from "../../types/ProjectItemFrontInterfaces.js";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({region:'ap-northeast-1'}));
const tableName = 'gantule';

export const editProjectInfo = async (event:APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
  try{
    // リクエストチェック
    const rc = new ExistBodyRequestChecker()
    if(!rc.check(event)){
      const rb = new ResponseBuilder();
      rb.error();
      rb.addErrorMsg('system', 'プロジェクト情報の編集に失敗しました。');
      return rb.getProxyResponse()
    }

    // バリデーション
    const body = JSON.parse(event.body??'');
    console.log(body)
    const info = body.projectInfo as ProjectFI;
    const userId = body.userId as string;
    const v = new ValidationContext();
    v.add(new ValidationBuilder(info.projectId,'プロジェクトID','projectId').require())
    v.add(new ValidationBuilder(info.name, 'プロジェクト名', 'projectName').require());
    v.add(new ValidationBuilder(info.client, '依頼主', 'client').require());
    v.add(new ValidationBuilder(info.startDt, 'プロジェクト開始日', 'stardDt').require());
    v.add(new ValidationBuilder(info.endDt, 'プロジェクト終了日', 'endDt'));
    v.add(new ValidationBuilder(userId, 'ユーザーID', 'userId'));

    if(!v.validate()){
      const rb = new ResponseBuilder();
      rb.error();
      rb.setErrorMsg(v.errorInfos);
      return rb.getProxyResponse();
    }
    console.log('バリデーションOK')
    const sortKey = `${userId}@PROJECT@${info.projectId}`;
    const cmd = new GetCommand({
      TableName:tableName,
      Key:{
        pk:userId,
        sk:sortKey
      }
    })
    
    const result = await client.send(cmd);
    
    if(!result.Item){
      const rb = new ResponseBuilder();
      rb.error();
      rb.addErrorMsg('system', '指定されたプロジェクトは存在しません。');
      return rb.getProxyResponse();
    }
    console.log('プロジェクトの存在チェックOK')
    console.log(result)

    // 登録処理
    const registCmd = new PutCommand({
      TableName:tableName,
      Item:{
        pk:userId,
        sk:sortKey,
        name:info.name,
        client:info.client,
        startDt:info.startDt,
        endDt:info.endDt
      }
    });
    const registRslt:PutCommandOutput = await client.send(registCmd);
    console.log('登録完了');
    console.log(registRslt);

    const rb = new ResponseBuilder();
    rb.ok();
    rb.setFlashMsg('プロジェクトの登録が完了しました。')
    return rb.getProxyResponse();

  }catch(error){
    console.log(error);
    const rb = new ResponseBuilder()
    rb.error();
    rb.addErrorMsg('system', 'サーバー側でエラーが発生しました。');
    return rb.getProxyResponse();
  }
}