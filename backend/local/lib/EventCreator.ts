import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from "aws-lambda";

export const createEvent = (
  method:string,
  path:string,
  overrides: Partial<APIGatewayProxyEventV2> = {}
): APIGatewayProxyEventV2 => ({

  version: "2.0",

  routeKey: "$default",

  rawPath: path,

  rawQueryString: "",

  headers: {},

  requestContext: {
    accountId: "123456789012",
    apiId: "api-id",
    domainName: "example.com",
    domainPrefix: "example",
    http: {
      method: method,
      path: path,
      protocol: "HTTP/1.1",
      sourceIp: "127.0.0.1",
      userAgent: "jest",
    },
    requestId: "request-id",
    routeKey: "$default",
    stage: "stage",
    time: new Date().toISOString(),
    timeEpoch: Date.now(),
  },

  isBase64Encoded: false,

  body: undefined,

  ...overrides,
});

export const createBody = (obj:any) => {
  return JSON.stringify(obj);
}