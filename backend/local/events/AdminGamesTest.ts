import { createBody, createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";
import { JwtCreator } from "local/lib/JwtCreator.js";
import { TestFunctionUtil } from "local/lib/TestFunctionUtil.js";
import { PlayerForm } from "@scobit/types";

const TARGET_TEAM_ID = 'f41831c8-04be-4577-b1df-a53e1cf5bf8a';
// const TARGET_PLAYER_ID = '89de77f5-01a3-4493-83a4-3ea891369b5c';
const TARGET_PLAYER_ID = '75d64368-a9c8-4b97-a697-9f8a4108d188';
const testName = '試合結果一覧ページAPI';
const baseEvent = createEvent({
  httpMethod: 'POST',
  path: '/games/init',
  resource: '/games/init',
  headers: {
    authorization: `Bearer ${JwtCreator.create([{ key: 'team_id', val: TARGET_TEAM_ID }])}`
  }
})
// const baseUpdateMemberEvent = createEvent({
//   httpMethod: 'POST',
//   path: '/member/update',
//   resource: '/member/update',
//   headers: {
//     authorization: `Bearer ${JwtCreator.create([{ key: 'team_id', val: TARGET_TEAM_ID }])}`
//   }
// })

const createNewPlayer = ():PlayerForm => {
  const num = TestFunctionUtil.randInt(0, 99);
  return {
    player_id:TARGET_PLAYER_ID,
    name:`テスト　太郎${num.toString()}`,
    disp_name:`太郎${num.toString()}`,
    throw_distance:TestFunctionUtil.randInt(50, 120),
    positions:TestFunctionUtil.randomPositions()
  }
}

export const AdminGamesPatterns: TestPattern[] = [
  {
    api_id: 'games_init',
    test_case: 'ok',
    name: `${testName}（初期情報取得） 正常系`,
    event: { ...baseEvent }
  },
  // {
  //   api_id: 'member_update',
  //   test_case: 'ok',
  //   name: `${testName}（選手情報更新） 正常系`,
  //   event: { ...baseUpdateMemberEvent, body:createBody(createNewPlayer()) }
  // },
]