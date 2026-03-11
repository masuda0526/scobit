import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ResponseFormat } from "@scobit/types";
import { getDynamoDBDocumentClient } from "src/libs/DynamoDBUtil/DynamoDBUtil.js";
import { resolveTeamId } from "src/libs/DynamoDBUtil/SlugUtil.js";
import { env } from "src/libs/EnvPropertyUtil/Env.js";
import { Res } from "src/libs/ResponseUtil/ResponseUtil.js";
import z from "zod";

export async function getTeamController(body:any):Promise<ResponseFormat> {

  const input = Schema.parse(body);
  const t_id = resolveTeamId(input.alias_id);

  if(!t_id){
    return Res.error().addError('alias_id', '対象チームが存在しません。').toResponse();
  }

  const client = getDynamoDBDocumentClient();
  const cmd = new QueryCommand({
    TableName:env.DB_TABLE,
    KeyConditionExpression:'pk = :pk and sk = :sk',
    ExpressionAttributeValues:{
      
    }
  })
}

const Schema = z.object({
  alias_id:z.string().min(5).max(20)
})