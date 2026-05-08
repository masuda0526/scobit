import { createEvent } from "local/lib/EventCreator.js";
import { TestPattern } from "./TestPatterns.js";
import { email } from "zod";

const testName = 'ログイン画面';

const baseEvent = createEvent({
  httpMethod:'POST',
  path:'/login',
  resource:'/login',
  body:JSON.stringify({
    email:'test_59@test.com',
    pass:'testpass1234'
  })
})

export const LoginPattern:TestPattern[] = [
  {
    api_id:'login',
    test_case:'pass_ok',
    name:`${testName} ログイン成功`,
    event:{...baseEvent}
  },
  {
    api_id:'login',
    test_case:'pass_nomatch',
    name:`${testName} パスワードエラー`,
    event:{...baseEvent, body:JSON.stringify({email:'mail_cb9aeh30uy@test.com',pass:'noMatchPass1234'})}
  }
]