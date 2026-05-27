import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda"
import { routerHandler } from "src/Router/RouterHandler.js"

export const handler = async (event:APIGatewayProxyEventV2):Promise<APIGatewayProxyResult> => {
  return await routerHandler(event);
}