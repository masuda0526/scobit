import { createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";

const testName = '試合詳細画面'
const baseEvent = createEvent({
  httpMethod:'GET',
  path:'/game/score',
  resource:'/game/score',
  pathParameters:{
    public_id:'n340v',
    game_id:'83d43bac-ed05-4ec6-a74a-d242f17c0a17'
  }
})

export const GameDetailPatterns:TestPattern[] = [
  {
    api_id:'gameDetail',
    test_case:'ok',
    name: `${testName} 正常系`,
    event:{...baseEvent}
  }
]