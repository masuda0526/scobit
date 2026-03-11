import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoDBDocumentClient } from "./DynamoDBUtil.js"
import { env } from "../EnvPropertyUtil/Env.js";
import { logger } from "../Logger/Logger.js";

export const resolveTeamId = async (alias_id:string) => {
  const client = getDynamoDBDocumentClient();
  const cmd = new QueryCommand({
    TableName:env.DB_TABLE,
    KeyConditionExpression:'pk = :pk and sk = :sk',
    ExpressionAttributeValues: {
      ":pk": `SLUG`,
      ":sk": `ALIAS#${alias_id}`
    },
    Limit:1
  });

  const result = await client.send(cmd);
  if(!result.Items || result.Items.length === 0){
    logger.debug(`該当するチームはありません。`);
    return '';
  }
  const t_id = result.Items[0].t_id;
  logger.debug(`RESOLVE_SLUG:${alias_id} -> ${t_id}`);
  return t_id;
}