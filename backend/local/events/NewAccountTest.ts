import { NewAccountDto } from "@scobit/types";
import { createEvent } from "local/lib/EventCreator.js";
import { createRandomAlias, randInt, randomPositions } from "seeder/seeder_functions/util.js";
import { TestPattern } from "./TestPatterns.js";

const testName = '新規登録API';

const createNewDto = ():NewAccountDto => {
  const prefix = randInt(0, 99);
  const dto : NewAccountDto = {
    name:`テスト　太郎${prefix}`,
    disp_name:`太郎${prefix}`,
    positions:randomPositions(),
    throw_distance:randInt(50, 120).toString(),
    pass:'testpass1234',
    account_pub_id:createRandomAlias(randInt(5, 20)),
    email:`test_${prefix}@test.com`
  }
  return dto;
}

const baseEvent = createEvent({
  httpMethod:'POST',
  path:'/new',
  resource:'/new',
  body:JSON.stringify(createNewDto())
})

export const NewAccountPattern:TestPattern[] = [
  {
    api_id:'new_account',
    test_case:'ok',
    name:`${testName} 成功パターン`,
    event:{...baseEvent}
  }
]