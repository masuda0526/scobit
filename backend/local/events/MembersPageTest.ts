import { createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";

const testName = '選手一覧画面'
const baseEvent = createEvent({
  httpMethod:'GET',
  path:'/members',
  resource:'/members',
  pathParameters:{
    public_id:'n340v',
  }
})

export const MembersPattern:TestPattern[] = [
  {
    api_id:'members',
    test_case:'ok',
    name: `${testName} 正常系`,
    event:{...baseEvent}
  }
]