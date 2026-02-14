import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { logger } from "../Logger/Logger.js";


export const getDynamoDBDocumentClient = () => {
    logger.debug('getDynamoDBDocumentClient()')
    const isLocal = process.env.STAGE === "local";
    console.log(`STAGE:${process.env.STAGE}`)

    const client = DynamoDBDocumentClient.from(new DynamoDBClient({ 
      region: 'ap-northeast-1' ,
      ...(
        isLocal && {
          endpoint: process.env.DYNAMO_ENDPOINT,
          credentials: {
            accessKeyId: "dummy",
            secretAccessKey: "dummy",
          }
        }
      )
    }))

    return client;
} 