import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, GetCommandInput, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ExistBodyRequestChecker } from "../../libs/RequestUtil/RequestChecker.js";
import { ResponseBuilder } from "../../libs/ResponseUtil/ResponseBuilder.js";
import { ValidationContext } from "../../libs/Validation/ValidationContext.js";
import { ValidationBuilder } from "../../libs/Validation/ValidationBuilder.js";
import { toObjProject } from "../../libs/ProjectItemUtil.js";
import { ProjectItem } from "../../types/Project.js";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({region:'ap-northeast-1'}));
const tableName = 'gantule';

export const getProjects = async (event:APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
  try{
    console.log('プロジェクト一覧取得処理開始')

    // バリデーション
    const userId = event.queryStringParameters?.userId??'';
    const v = new ValidationContext()
    v.add(new ValidationBuilder(userId, 'ユーザー名', 'userId').require());
    if(!v.validate()){
      const responseBuilder = new ResponseBuilder()
      responseBuilder.error();
      responseBuilder.setErrorMsg(v.errorInfos);
      return responseBuilder.getProxyResponse()
    }
    console.log('バリデーションOK');
    console.log(`ユーザーID：  ${userId}`)

    // プロジェクト取得
    const command:QueryCommand = new QueryCommand({
      TableName:tableName,
      KeyConditionExpression:"pk=:userId",
      ExpressionAttributeValues:{
        ":userId":userId
      }
    })
    const result = await client.send(command);
    console.log(result);

    //  プロジェクト抽出
    const items:ProjectItem[] = []
    result.Items?.forEach(item => {
      if(isProject(item)){
        items.push(toObjProject(item));
      }
    })

    const responseBuilder = new ResponseBuilder();
    responseBuilder.ok();
    responseBuilder.putData('projects', items);
    return responseBuilder.getProxyResponse()
    
  }catch(error){
    console.log(error);
    const responseBuilder = new ResponseBuilder();
    responseBuilder.error()
    responseBuilder.addErrorMsg('system', 'サーバー側でエラーが発生しました');
    return responseBuilder.getProxyResponse();
  }
}

const isProject = (item:any):boolean => {
  const sk:string = item?.sk??'' as string
  const l:string[] = sk.split('@');
  if(l[1] === 'PROJECT'){
    return true;
  }
  return false;
}