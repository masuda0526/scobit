import { createBody, createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";
import { JwtCreator } from "local/lib/JwtCreator.js";
import { TeamForm } from "@scobit/types";
import { TestFunctionUtil } from "local/lib/TestFunctionUtil.js";

const TARGET_TEAM_ID = 'f41831c8-04be-4577-b1df-a53e1cf5bf8a';
const testName = '管理用チームページAPI';
const baseEvent = createEvent({
  httpMethod: 'POST',
  path: '/team/init',
  resource: '/team/init',
  headers: {
    authorization: `Bearer ${JwtCreator.create([{ key: 'team_id', val: TARGET_TEAM_ID }])}`
  }
})
const baseUpdateEvent = createEvent({
  httpMethod: 'POST',
  path: '/team/update',
  resource: '/team/update',
  headers: {
    authorization: `Bearer ${JwtCreator.create([{ key: 'team_id', val: TARGET_TEAM_ID }])}`
  }
})

const makeInputTeam = (): TeamForm => {
  return {
    team_id: TARGET_TEAM_ID,
    public_id: TestFunctionUtil.createRandomAliasNotNumberToFirstChar(TestFunctionUtil.randInt(5, 20)),
    team_name: `テストチーム${TestFunctionUtil.randInt(1, 99)}`,
    pref: TestFunctionUtil.getRandomPref(),
    area: TestFunctionUtil.createRandomAlias(TestFunctionUtil.randInt(5, 10)),
    description: [
      undefined,
      TestFunctionUtil.createRandomAlias(TestFunctionUtil.randInt(10, 50)),
      ''
    ][TestFunctionUtil.randInt(0, 3)],
    created_at: TestFunctionUtil.randomDate()
  }
}

export const AdminTeamPattern: TestPattern[] = [
  {
    api_id: 'team_init',
    test_case: 'ok',
    name: `${testName}（初期情報取得） 正常系`,
    event: { ...baseEvent }
  },
  {
    api_id: 'team_update',
    test_case: 'ok',
    name: `${testName}（チーム情報更新） 正常系`,
    event: { ...baseUpdateEvent, body: createBody(makeInputTeam()) }
  },
]