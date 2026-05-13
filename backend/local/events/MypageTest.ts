import { createBody, createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";
import { JwtCreator } from "local/lib/JwtCreator.js";

const testName = 'マイページAPI'
const testNameSelect = 'マイページAPI（チーム選択）'
const testNameKojin = 'マイページAPI（個人アカウント）'
const baseEvent = createEvent({
  httpMethod:'POST',
  path:'/mypage/teams',
  resource:'/mypage/teams',
  headers:{
    authorization:`Bearer ${JwtCreator.create()}`
  }
})
const baseSelectEvent = createEvent({
  httpMethod:'POST',
  path: '/mypage/select',
  resource:'/mypage/select',
  body:createBody({
    team_id:'f41831c8-04be-4577-b1df-a53e1cf5bf8a'
  }),
  headers:{
    authorization:`Bearer ${JwtCreator.create()}`
  }
})
const baseKojinEvent = createEvent({
  httpMethod:'POST',
  path: '/mypage/kojin',
  resource:'/mypage/kojin',
  headers:{
    authorization:`Bearer ${JwtCreator.create()}`
  }
})

export const MypagePatterns:TestPattern[] = [
  {
    api_id:'mypage_fetch_teams',
    test_case:'ok',
    name: `${testName} 正常系`,
    event:{...baseEvent}
  },
  {
    api_id:'mypage_select_team',
    test_case:'ok',
    name: `${testNameSelect} 正常系`,
    event:{...baseSelectEvent}
  },
  {
    api_id:'mypage_kojin',
    test_case:'ok',
    name: `${testNameKojin} 正常系`,
    event:{...baseKojinEvent}
  }
]