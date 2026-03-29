import { createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";

const testName = '試合一覧画面'
const baseEvent = createEvent({
  httpMethod:'GET',
  path:'/games',
  resource:'/games',
  pathParameters:{
    public_id:'n340v',
  }
})

export const GamesPatterns:TestPattern[] = [
  {
    api_id:'games',
    test_case:'ok',
    name: `${testName} 正常系`,
    event:{...baseEvent}
  }
]