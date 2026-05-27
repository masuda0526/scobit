import { APIGatewayProxyResult } from "aws-lambda";
import { ResponseBodyBuilder } from "./ResponseBuilder.js";

export class ResponseUtil {

  static success<T extends Record<string, any> = Record<string, any>>() {
    return new ResponseBodyBuilder<T>(true);
  }

  static error<T extends Record<string, any> = Record<string, any>>() {
    return new ResponseBodyBuilder<T>(false);
  }

  static parseToAPIGatewayResponse(responseBody: ResponseBodyBuilder): APIGatewayProxyResult{
    return {
      statusCode:200,
      body:JSON.stringify(responseBody.toResponse())
    }
  }

}