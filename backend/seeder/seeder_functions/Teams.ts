import { Team } from "@scobit/types"
import { randomUUID } from "crypto"
import { createRandomAlias, getRandomPref, randInt } from "./util.js";

export const makeTeam = (leader_id:string):Team => {
  const now = new Date();
  const team_id = randomUUID();
  const public_id = createRandomAlias(randInt(5, 20))
  return {
    team_id,public_id,
    team_name: `テストチーム${randInt(0,100)}`,
    leader_id,
    pref: getRandomPref(),
    area: `テスト地域${randInt(0, 100)}`,
    created_at: now,
    updated_at: now,
    regist_at: now,
  }
}
