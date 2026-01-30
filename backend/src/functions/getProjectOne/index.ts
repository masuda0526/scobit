import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { ValidationContext } from "../../libs/Validation/ValidationContext.js";
import { ValidationBuilder } from "../../libs/Validation/ValidationBuilder.js";
import { ResponseBuilder } from "../../libs/ResponseUtil/ResponseBuilder.js";
import { DynamoDBDocumentClient, GetCommand, GetCommandOutput, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Subject, Task } from "../../types/ProjectItemInterfaces.js";
import { fetchProjectOne } from "../../libs/ProjectOperate/ProjectOperate.js";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({region:'ap-northeast-1'}));
const tableName = 'gantule';

export const getProjectOne = async (event:APIGatewayEvent):Promise<APIGatewayProxyResult> => {
  try{
    console.log('プロジェクト取得処理開始');

    // バリデーション
    const projectId = event.queryStringParameters?.projectId??'';
    const v = new ValidationContext()
    v.add(new ValidationBuilder(projectId, 'プロジェクトID', 'projectId').require());
    if(!v.validate()){
      const rb = new ResponseBuilder();
      rb.error();
      rb.setErrorMsg(v.errorInfos);
      return rb.getProxyResponse();
    }
    console.log('バリデーションOK');

    // // プロジェクト取得
    // const command = new GetCommand({
    //   TableName:tableName,
    //   Key:{
    //     pk:projectId,
    //     sk:`${projectId}@DATA`
    //   }
    // })
    // const result:GetCommandOutput = await client.send(command);
    // console.log('データ取得');
    // console.log(result);

    // // １件もない場合
    // if(!result.Item){
    //   const rb = new ResponseBuilder();
    //   rb.error();
    //   rb.addErrorMsg('projectId', '指定されたプロジェクトが存在しません。');
    //   console.log(rb);
    //   return rb.getProxyResponse();
    // }

    const subjects = await fetchProjectOne(projectId);
    if(!subjects){
      const rb = new ResponseBuilder();
      rb.error();
      rb.addErrorMsg('projectId', '指定されたプロジェクトが存在しません。');
      console.log(rb);
      return rb.getProxyResponse();
    }

    const rb = new ResponseBuilder();
    rb.ok();
    rb.putData('projectData', subjects);
    console.log(rb);
    return rb.getProxyResponse();

  }catch(error){
    console.log(error);
    const rb = new ResponseBuilder();
    rb.error();
    rb.addErrorMsg('system', 'サーバー側でエラーが発生しました。');
    return rb.getProxyResponse();
  }
}

const toObj = (item:any):Subject[] => {
  const l:Subject[] = []
  if (!item || !Array.isArray(item.data)) return l;
  if(Array.isArray(item.data)){
    item.data.forEach((sj:any) => {
      const subject = new Subject(sj.name, sj.startDt, sj.endDt, sj.status, sj.subjectId, sj.leader);
      if(Array.isArray(sj.tasks)){
        sj.tasks.forEach((ts:any) =>{
          const task = new Task(ts.name, ts.startDt, ts.endDt, ts.status, ts.subjectId, ts.taskId, ts.manager);
          subject.addItem(task);
        })
      }
      l.push(subject);
    })
  }
  return l;
}