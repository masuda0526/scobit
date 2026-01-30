import { APIGatewayProxyResult } from "aws-lambda";
import { ErrorInfo, ResponseFormat } from "./ResponseFormat.js";

export class ResponseBuilder {
  response: ResponseFormat;
  header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  }

  constructor() {
    this.response = {
      isSuccess: true,
      isRedirect: false,
      errors: [],
    }
  }

  ok() {
    this.response = {
      isSuccess: true,
      isRedirect: false,
      errors: [],
      headers:this.header
    }
  }

  error() {
    this.response = {
      isSuccess: false,
      isRedirect: false,
      errors: [],
      headers:this.header
    }
  }

  addErrorMsg(field: string, msg: string) {
    if (!this.response.errors) {
      this.response.errors = []
    }
    this.response.errors.push({ field: field, message: msg });
  }

  setErrorMsg(errors: ErrorInfo[]) {
    if (!this.response.errors) {
      this.response.errors = [];
    }
    this.response.errors = [...this.response.errors, ...errors];
  }

  setFlashMsg(msg: string) {
    if (!this.response.flashMsgs) {
      this.response.flashMsgs = []
    }
    this.response.flashMsgs.push(msg);
  }

  getResponse(): ResponseFormat {
    return this.response
  }

  getProxyResponse(): APIGatewayProxyResult {
    return {
      statusCode: 200,
      headers: this.header,
      body: JSON.stringify(this.response)
    }
  }

  putData(key: string, data: any) {
    if (!this.response.data) {
      this.response.data = {};
    }
    this.response.data[key] = data;
  }
}