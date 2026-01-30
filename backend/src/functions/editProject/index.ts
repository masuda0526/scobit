import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ExistBodyRequestChecker } from "../../libs/RequestUtil/RequestChecker.js";
import { ResponseBuilder } from "../../libs/ResponseUtil/ResponseBuilder.js";
import { ProjectData, ProjectItem } from "../../types/Project.js";
import { addProjectValidator, addSubjectValidator, addTaskValidator, parseProject } from "../../libs/ProjectItemUtil.js";
import { ValidationContext } from "../../libs/Validation/ValidationContext.js";
import { fetchProjectOne } from "../../libs/ProjectOperate/ProjectOperate.js";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({region:'ap-northeast-1'}));
const tableName = 'gantule';

export const editProject = async (event:APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
  console.log('editProject()処理開始')
  try{
    // リクエストチェック
    const requestChecker = new ExistBodyRequestChecker()
    if(!requestChecker.check(event)){
      const responseBuilder = new ResponseBuilder()
      responseBuilder.error()
      responseBuilder.addErrorMsg('system', 'プロジェクトの追加または修正に失敗しました。');
      return responseBuilder.getProxyResponse();
    }
    console.log(event)
    console.log('リクエストチェックOK');

    // バリデーション
    const body = JSON.parse(event.body?event.body:'');
    console.log('バリデーション開始');
    console.log(body);
    const project = parseProject(body);
    console.log(project);
    const v = new ValidationContext()
    addProjectValidator(project, v)
    project.subjects.forEach(sj => {
      addSubjectValidator(sj, v)
      sj.getChildItem().forEach(t => {
        addTaskValidator(t, v, sj.subjectId);
      })
    })

    if(!v.validate()){
      console.log('バリデーションNG');
      const responseBuilder = new ResponseBuilder()
      responseBuilder.error();
      responseBuilder.setErrorMsg(v.errorInfos);
      return responseBuilder.getProxyResponse()
    }

    console.log('課題の登録開始');
    const data:ProjectData = {
      pk:project.projectId,
      sk:`${project.projectId}@DATA`,
      data:project.subjects
    }
    
    const params:PutCommandInput = {
      TableName:tableName,
      Item:JSON.parse(JSON.stringify(data))
    }
    console.log(params);
    await client.send(new PutCommand(params));

    console.log('課題の登録成功');

    const subjects = await fetchProjectOne(project.projectId);

    const responseBuilder = new ResponseBuilder();
    responseBuilder.ok()
    responseBuilder.putData('subjects', subjects);
    return responseBuilder.getProxyResponse();

  }catch(error){
    console.log(error);
    const responseBuilder = new ResponseBuilder();
    responseBuilder.error()
    responseBuilder.addErrorMsg('system', 'サーバー側でエラーが発生しました。');
    return {      
      statusCode:500,
      body:JSON.stringify(responseBuilder.getResponse())
    }
  }

}