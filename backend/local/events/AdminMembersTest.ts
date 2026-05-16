import { createBody, createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";
import { JwtCreator } from "local/lib/JwtCreator.js";
import { PlayerForm } from "@scobit/types";
import { TestFunctionUtil } from "local/lib/TestFunctionUtil.js";
import { randInt } from "seeder/seeder_functions/util.js";

const TARGET_TEAM_ID = 'f41831c8-04be-4577-b1df-a53e1cf5bf8a';
const testName = '管理用選手一覧ページAPI';
const baseEvent = createEvent({
  httpMethod: 'POST',
  path: '/members/init',
  resource: '/members/init',
  headers: {
    authorization: `Bearer ${JwtCreator.create([{ key: 'team_id', val: TARGET_TEAM_ID }])}`
  }
})
const baseAddMemberEvent = createEvent({
  httpMethod: 'POST',
  path: '/members/add',
  resource: '/members/add',
  headers: {
    authorization: `Bearer ${JwtCreator.create([{ key: 'team_id', val: TARGET_TEAM_ID }])}`
  }
})

const createNewPlayer = ():PlayerForm => {
  const num = TestFunctionUtil.randInt(0, 99);
  return {
    player_id:crypto.randomUUID(),
    name:`テスト　太郎${num.toString()}`,
    disp_name:`太郎${num.toString()}`,
    throw_distance:TestFunctionUtil.randInt(50, 120),
    positions:TestFunctionUtil.randomPositions()
  }
}

export const AdminMembersPattern: TestPattern[] = [
  {
    api_id: 'members_init',
    test_case: 'ok',
    name: `${testName}（初期情報取得） 正常系`,
    event: { ...baseEvent }
  },
  {
    api_id: 'members_new_player',
    test_case: 'ok',
    name: `${testName}（選手追加） 正常系`,
    event: { ...baseAddMemberEvent, body:createBody(createNewPlayer()) }
  },
]