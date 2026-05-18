import { createBody, createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";
import { JwtCreator } from "local/lib/JwtCreator.js";
import { TestFunctionUtil } from "local/lib/TestFunctionUtil.js";
import { GameForm } from "@scobit/types";
import { ScobitFunction } from "@scobit/common";

const TARGET_TEAM_ID = 'f41831c8-04be-4577-b1df-a53e1cf5bf8a';
const TARGET_GAME_ID = '1ecf61a3-7ed5-4437-8355-12a233bde816';
const TARGET_TOURNAMENT_ID = '4c45b0c1-7575-4e54-baaf-fd4bdfded8a9';

const testName = '試合結果編集ページAPI';
const baseEvent = createEvent({
  httpMethod: 'POST',
  path: '/game/edit/init',
  resource: '/game/edit/init',
  headers: {
    authorization: `Bearer ${JwtCreator.create([{ key: 'team_id', val: TARGET_TEAM_ID }])}`
  }
})
const baseUpdateGameEvent = createEvent({
  httpMethod: 'POST',
  path: '/game/edit/update',
  resource: '/game/edit/update',
  headers: {
    authorization: `Bearer ${JwtCreator.create([{ key: 'team_id', val: TARGET_TEAM_ID }])}`
  }
})

const createUpdateGame = ():GameForm=> {
  const my_point = TestFunctionUtil.randInt(0, 20);
  const op_point = TestFunctionUtil.randInt(0, 20);
  return {
    game_id:TARGET_GAME_ID,
    seq:TestFunctionUtil.randInt(0, 5),
    tournament_id:TARGET_TOURNAMENT_ID,
    opponent:`対戦相手${TestFunctionUtil.randInt(0, 99)}`,
    my_point, op_point,
    result:ScobitFunction.getGameResult(my_point, op_point, false),
    game_dt:TestFunctionUtil.randomDate()
  }
}

export const AdminGameEditPatterns: TestPattern[] = [
  {
    api_id: 'game_edit_init',
    test_case: 'ok',
    name: `${testName}（初期情報取得） 正常系`,
    event: { ...baseEvent, body:createBody({game_id:TARGET_GAME_ID}) }
  },
  {
    api_id: 'game_edit_update',
    test_case: 'ok',
    name: `${testName}（試合結果編集） 正常系`,
    event: { ...baseUpdateGameEvent, body:createBody(createUpdateGame())}
  },
  // {
  //   api_id: 'member_update',
  //   test_case: 'ok',
  //   name: `${testName}（選手情報更新） 正常系`,
  //   event: { ...baseUpdateMemberEvent, body:createBody(createNewPlayer()) }
  // },
]