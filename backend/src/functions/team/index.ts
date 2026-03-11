import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, GetCommandInput, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ExistBodyRequestChecker } from "../../libs/RequestUtil/RequestChecker.js";
import { ResponseBuilder } from "../../libs/ResponseUtil/ResponseBuilder.js";
import { ValidationContext } from "../../libs/Validation/ValidationContext.js";
import { ValidationBuilder } from "../../libs/Validation/ValidationBuilder.js";
import { toObjProject } from "../../libs/ProjectItemUtil.js";
import { ProjectItem } from "../../types/Project.js";
import { logger } from "src/libs/Logger/Logger.js";
import { getDynamoDBDocumentClient } from "src/libs/DynamoDBUtil/DynamoDBUtil.js";
import z from "zod";

// const client = DynamoDBDocumentClient.from(new DynamoDBClient({region:'ap-northeast-1'}));
const client = getDynamoDBDocumentClient();

export const handler = async (event:APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
  logger.debug(`チーム情報取得処理開始`);

  const body = JSON.parse(event.body??'');

  const schema = z.object({
    alias_id:z.string().min(5).max(20)
  })

  const input = schema.parse(body);

  
  
}