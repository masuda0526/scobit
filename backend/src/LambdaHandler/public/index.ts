import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { routerHandler } from "src/Router/RouterHandler.js"

export const handler = async (event:APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
  return await routerHandler(event);
}