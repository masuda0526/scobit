import { APIGatewayProxyEvent } from "aws-lambda";
import dotenv from "dotenv";
import { handler } from "src/LambdaHandler/index.js";
import { createEvent } from "./lib/EventCreator.js";

dotenv.config({ path: ".env.local" });

const event:APIGatewayProxyEvent = createEvent({
  httpMethod:'GET',
  path:'/member/game',
  resource:'/member/game',
  pathParameters:{
    public_id:'n340v',
    player_id:'7d795853-a301-4837-b933-a677275e8993'
  }
});

(async () => {
  console.log("=== ローカルテスト開始 ===");
  
  const res = await handler(event)
  
  console.log("⚪︎ レスポンス ");
  console.log(res);
  console.log("=== ローカルテスト終了 ===");
})();
