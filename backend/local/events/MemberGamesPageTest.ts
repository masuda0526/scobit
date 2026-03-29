import { createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";

const testName = '選手試合結果一覧画面'
const baseEvent = createEvent({
  httpMethod:'GET',
  path:'/member/game',
  resource:'/member/game',
  pathParameters:{
    public_id:'n340v',
    player_id:'9a8eab60-58e3-4635-844c-fd13890512b4'
  }
})

export const MemberGamesPatterns:TestPattern[] = [
  {
    api_id:'member_games',
    test_case:'ok',
    name: `${testName} 正常系`,
    event:{...baseEvent}
  }
]