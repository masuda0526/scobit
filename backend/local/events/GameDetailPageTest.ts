import { createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";

const testName = '試合詳細画面'
const baseEvent = createEvent({
  httpMethod:'GET',
  path:'/game/score',
  resource:'/game/score',
  pathParameters:{
    public_id:'n340v',
    game_id:'90592b49-e7cb-4525-9dad-4f7290cf18fd'
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