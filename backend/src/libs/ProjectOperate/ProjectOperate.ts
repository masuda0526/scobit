import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb"
import { ResponseBuilder } from "../ResponseUtil/ResponseBuilder.js";
import { Subject, Task } from "../../types/ProjectItemInterfaces.js";


const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'ap-northeast-1' }));
const tableName = 'gantule';

export const fetchProjectOne = async (projectId: string):Promise<Subject[]|null> => {
  console.log('プロジェクト情報を取得します。')

  const command = new GetCommand({
    TableName: tableName,
    Key: {
      pk: projectId,
      sk: `${projectId}@DATA`
    }
  })

  const result: GetCommandOutput = await client.send(command);
  console.log('データ取得');
  console.log(result);

  // １件もない場合
  if (!result.Item) {
    console.log('プロジェクトデータなし。')
    return null;
  }

  return toObj(result.Item);
}

const toObj = (item: any): Subject[] => {
  const l: Subject[] = []
  if (!item || !Array.isArray(item.data)) return l;
  if (Array.isArray(item.data)) {
    item.data.forEach((sj: any) => {
      const subject = new Subject(sj.name, sj.startDt, sj.endDt, sj.status, sj.subjectId, sj.leader);
      if (Array.isArray(sj.tasks)) {
        sj.tasks.forEach((ts: any) => {
          const task = new Task(ts.name, ts.startDt, ts.endDt, ts.status, ts.subjectId, ts.taskId, ts.manager);
          subject.addItem(task);
        })
      }
      l.push(subject);
    })
  }
  return l;
}