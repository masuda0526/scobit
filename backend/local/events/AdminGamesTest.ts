import { createBody, createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";
import { JwtCreator } from "local/lib/JwtCreator.js";
import { TestFunctionUtil } from "local/lib/TestFunctionUtil.js";
import { GameForm } from "@scobit/types";
import { ScobitFunction } from "@scobit/common";

const TARGET_TEAM_ID = 'f41831c8-04be-4577-b1df-a53e1cf5bf8a';
const TARGET_TOURNAMENT_ID = '4c45b0c1-7575-4e54-baaf-fd4bdfded8a9';
const testName = '試合結果一覧ページAPI';
const baseEvent = createEvent({
  httpMethod: 'POST',
  path: '/games/init',
  resource: '/games/init',
  headers: {
    authorization: `Bearer ${JwtCreator.create([{ key: 'team_id', val: TARGET_TEAM_ID }])}`
  }
})
const baseNewGameEvent = createEvent({
  httpMethod: 'POST',
  path: '/games/new',
  resource: '/games/new',
  headers: {
    authorization: `Bearer ${JwtCreator.create([{ key: 'team_id', val: TARGET_TEAM_ID }])}`
  }
})

const createNewGame = ():GameForm=> {
  const my_point = TestFunctionUtil.randInt(0, 20);
  const op_point = TestFunctionUtil.randInt(0, 20);
  return {
    game_id:crypto.randomUUID(),
    seq:TestFunctionUtil.randInt(0, 5),
    tournament_id:TARGET_TOURNAMENT_ID,
    opponent:`対戦相手${TestFunctionUtil.randInt(0, 99)}`,
    my_point, op_point,
    result:ScobitFunction.getGameResult(my_point, op_point, false),
    game_dt:TestFunctionUtil.randomDate()
  }
}

export const AdminGamesPatterns: TestPattern[] = [
  {
    api_id: 'games_init',
    test_case: 'ok',
    name: `${testName}（初期情報取得） 正常系`,
    event: { ...baseEvent }
  },
  {
    api_id: 'games_new',
    test_case: 'ok',
    name: `${testName}（新規登録） 正常系`,
    event: { ...baseNewGameEvent, body:createBody(createNewGame())}
  },
  // {
  //   api_id: 'member_update',
  //   test_case: 'ok',
  //   name: `${testName}（選手情報更新） 正常系`,
  //   event: { ...baseUpdateMemberEvent, body:createBody(createNewPlayer()) }
  // },
]