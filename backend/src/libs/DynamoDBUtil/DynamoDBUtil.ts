import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { logger } from "../Logger/Logger.js";
import { env } from "../EnvPropertyUtil/Env.js";

const region = env.AWS_REGION;
const endpoint = env.DYNAMO_ENDPOINT;
const stage = env.STAGE;

export const getDynamoDBDocumentClient = () => {
    logger.debug('getDynamoDBDocumentClient()')
    const isLocal = stage === "local";
    logger.debug(`STAGE:${stage}`)

    const client = DynamoDBDocumentClient.from(new DynamoDBClient({ 
      region,
      ...(
        isLocal && {
          endpoint,
          credentials: {
            accessKeyId: "dummy",
            secretAccessKey: "dummy",
          }
        }
      )
    }))

    return client;
} 