import { createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";

const testName = '選手情報詳細画面'
const baseEvent = createEvent({
  httpMethod:'GET',
  path:'/member',
  resource:'/member',
  pathParameters:{
    public_id:'n340v',
    player_id:'9a8eab60-58e3-4635-844c-fd13890512b4'
  }
})

export const MemberPatterns:TestPattern[] = [
  {
    api_id:'member',
    test_case:'ok',
    name: `${testName} 正常系`,
    event:{...baseEvent}
  }
]