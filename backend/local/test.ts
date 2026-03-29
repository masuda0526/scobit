import { APIGatewayProxyEvent } from "aws-lambda";
import dotenv from "dotenv";
import { handler } from "src/LambdaHandler/index.js";
import { createEvent } from "./lib/EventCreator.js";
import { findTestPatterns, TestPattern } from "./events/TestPatterns.js";

dotenv.config({ path: ".env.local" });

const testPatterns = findTestPatterns([
  {api_id:'gameDetail', test_case:'ok'}
]);

const testOne = async (pattern:TestPattern, testNum:number) => {
  console.log(`[${testNum}]「${pattern.name}」開始 api_id=${pattern.api_id} test_case:${pattern.test_case}\n\n`);

  const res = await handler(pattern.event);
  console.log(`\n\n<<< レスポンス >>>\n `)
  console.debug(res.body);
  console.log('\n')


}

const run = async () => {
  
  console.log(`
==================================================
  テスト開始
==================================================


    `);
  
    try {
      for(let i = 0; i<testPatterns.length; i++){
        await testOne(testPatterns[i], i + 1);          
      }
    } catch (error) {
      console.log(`エラー発生`);
      console.error(error);
    }
  
  console.log(`

==================================================
  テスト終了
==================================================

    `);

};

await run();
// (async () => {
//   console.log("=== ローカルテスト開始 ===");
  
//   const res = await handler(event)
  
//   console.log("⚪︎ レスポンス ");
//   console.log(res);
//   console.log("=== ローカルテスト終了 ===");
// })();
