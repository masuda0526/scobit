import dotenv from "dotenv";
import {login} from '../src/functions/login/index.js'

dotenv.config({ path: ".env.local" });

const event = {
  body: JSON.stringify({
    userId: "test001",
    password: "1234"
  })
} as any;

(async () => {
  console.log("=== ローカルテスト開始 ===");

  const res = await login(event);

  console.log("=== レスポンス ===");
  console.log(res);
})();
