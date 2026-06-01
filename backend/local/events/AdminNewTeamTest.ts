import { createBody, createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";
import { JwtCreator } from "local/lib/JwtCreator.js";
import { prefArray, TeamForm } from "@scobit/types";
import { TestFunctionUtil } from "local/lib/TestFunctionUtil.js";

const testName = '管理用新規チーム作成API';
const baseEvent = createEvent({
  requestContext: 'POST',
  path: '/team/new',
  resource: '/team/new',
  headers: {
    authorization: `Bearer ${JwtCreator.create()}`
  },
})

const makeInputTeam = (): TeamForm => {
  return {
    team_id: crypto.randomUUID(),
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

export const AdminNewTeam: TestPattern[] = [
  {
    api_id: 'team_new',
    test_case: 'ok',
    name: `${testName}（新規チーム作成） 正常系`,
    event: { ...baseEvent, body:createBody(makeInputTeam()) }
  },
]