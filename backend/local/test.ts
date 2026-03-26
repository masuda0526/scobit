import { APIGatewayProxyEvent } from "aws-lambda";
import dotenv from "dotenv";
import { handler } from "src/LambdaHandler/index.js";
import { createEvent } from "./lib/EventCreator.js";

dotenv.config({ path: ".env.local" });

const event:APIGatewayProxyEvent = createEvent({
  httpMethod:'GET',
  path:'/team',
  resource:'/team',
  pathParameters:{
    public_id:'n340v',
  }
});

(async () => {
  console.log("=== ローカルテスト開始 ===");
  
  const res = await handler(event)
  
  console.log("⚪︎ レスポンス ");
  console.log(res);
  console.log("=== ローカルテスト終了 ===");
})();
