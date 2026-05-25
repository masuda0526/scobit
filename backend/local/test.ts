import dotenv from "dotenv";
import { handler } from "src/LambdaHandler/public/index.js";
import { findTestPatterns, TestPattern } from "./events/TestPatterns.js";

dotenv.config({ path: ".env.local" });

const testPatterns = findTestPatterns([
  // {api_id:'team', test_case:'ok'},
  // {api_id:'members', test_case:'ok'},
  // {api_id:'member', test_case:'ok'},
  // {api_id:'member_games', test_case:'ok'},
  // {api_id:'games', test_case:'ok'},
  // {api_id:'gameDetail', test_case:'ok'},
  // {api_id:'login', test_case:'pass_nomatch'},
  // {api_id:'login', test_case:'pass_ok'},
  // {api_id:'new_account', test_case:'ok'},
  // {api_id:'new_account', test_case:'dup_id'},
  // {api_id:'new_account', test_case:'dup_mail'},
  // {api_id:'mypage_fetch_teams', test_case:'ok'},
  // {api_id:'mypage_select_team', test_case:'ok'},
  // {api_id:'mypage_kojin', test_case:'ok'},
  // {api_id:'team_init', test_case:'ok'},
  // {api_id:'team_update', test_case:'ok'},
  // {api_id:'members_init', test_case:'ok'},
  // {api_id:'members_new_player', test_case:'ok'},
  // {api_id:'member_init', test_case:'ok'},
  // {api_id:'member_update', test_case:'ok'},
  // {api_id:'games_init', test_case:'ok'},
  // {api_id:'games_new', test_case:'ok'},
  // {api_id:'game_init', test_case:'ok'},
  // {api_id:'game_edit_init', test_case:'ok'},
  // {api_id:'game_edit_update', test_case:'ok'},
  {api_id:'game_edit_score', test_case:'ok'},
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
