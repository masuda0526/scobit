import { createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";

const testName = 'チーム情報画面'
const baseEvent = createEvent({
  httpMethod:'GET',
  path:'/team',
  resource:'/team',
  pathParameters:{
    public_id:'n340v',
  }
})

export const TeamPattern:TestPattern[] = [
  {
    api_id:'team',
    test_case:'ok',
    name: `${testName} 正常系`,
    event:{...baseEvent}
  }
]