import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, PutCommandInput, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid'
import { ProjectItem, ProjectRegist } from "../../types/index.js";
import { ExistBodyRequestChecker, ExistParamRequestChecker } from "../../libs/RequestUtil/RequestChecker.js";
import { ResponseBuilder } from "../../libs/ResponseUtil/ResponseBuilder.js";
import { ValidationContext } from "../../libs/Validation/ValidationContext.js";
import { RequireValidator } from "../../libs/Validation/RequireValidator.js";
import { ValidationBuilder } from "../../libs/Validation/ValidationBuilder.js";
import { toObjProject } from "../../libs/ProjectItemUtil.js";

const clientDoc = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'ap-northeast-1' }));
const tableName = 'gantule'

export const addProject = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const requestChecker = new ExistBodyRequestChecker()
    // requestChecker.setNext(new ExistParamRequestChecker('name', 'startDt', 'endDt', 'client'));
    if (!requestChecker.check(event)) {
      const responseBuilder = new ResponseBuilder()
      responseBuilder.error()
      responseBuilder.addErrorMsg('system', 'プロジェクトを追加できませんでした');
      return responseBuilder.getProxyResponse();
    }
    console.log('リクエストチェックOK');

    const body = JSON.parse(event.body ? event.body : '');
    const { userId, name, startDt, endDt, client } = body;
    const v = new ValidationContext()
    v.add(new ValidationBuilder(userId, 'ユーザーID', 'userId').require().length(5, 20))
    v.add(new ValidationBuilder(name, 'プロジェクト名', 'projectName').require().length(1, 30))
    v.add(new ValidationBuilder(startDt, 'プロジェクト開始日', 'startDt').require())
    v.add(new ValidationBuilder(endDt, 'プロジェクト終了日', 'endDt').require())
    v.add(new ValidationBuilder(client, '依頼者', 'client').length(1, 20))
    if (!v.validate()) {
      const resBuilder = new ResponseBuilder()
      resBuilder.error()
      resBuilder.setErrorMsg(v.errorInfos);
      return resBuilder.getProxyResponse();
    }
    console.log('バリデーションOK');
    console.log(body);

    const projectId = uuidv4();
    const data = {
      pk: userId,
      sk: `${userId}@PROJECT@${projectId}`,
      name: name,
      startDt: startDt,
      endDt: endDt,
      client: client
    }
    const params: PutCommandInput = {
      TableName: tableName,
      Item: data
    }
    await clientDoc.send(new PutCommand(params))

    const data2 = {
      pk:projectId,
      sk:`${projectId}@DATA`,
      data:[]
    }
    const params2: PutCommandInput = {
      TableName: tableName,
      Item: data2
    }

    await clientDoc.send(new PutCommand(params2));

    const responseBuilder = new ResponseBuilder();
    responseBuilder.ok();
    responseBuilder.setFlashMsg('プロジェクトの作成が完了しました。');
    console.log('プロジェクト作成完了')

    // プロジェクト取得
    const command: QueryCommand = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "pk=:userId",
      ExpressionAttributeValues: {
        ":userId": userId
      }
    })
    console.log(command);
    const result = await clientDoc.send(command);
    console.log('プロジェクト取得完了');
    console.log(result);

    //  プロジェクト抽出
    const items: ProjectItem[] = []
    result.Items?.forEach(item => {
      if (isProject(item)) {
        items.push(toObjProject(item));
      }
    })
    responseBuilder.putData('projects', items);
    return responseBuilder.getProxyResponse();
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'サーバー側でエラーが発生しました' })
    }
  }
}

const isProject = (item:any):boolean => {
  console.log(item)
  const sk:string = item?.sk??'' as string
  const l:string[] = sk.split('@');
  if(l[1] === 'PROJECT'){
    return true;
  }
  return false;
}