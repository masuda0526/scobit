import dotenv from "dotenv";
import {handler} from '../src/functions/NewTeam/index.js'
import { event } from "./events/newTeamEvent.js";

dotenv.config({ path: ".env.local" });

(async () => {
  console.log("=== ローカルテスト開始 ===");

  const res = await handler(event);

  console.log("=== レスポンス ===");
  console.log(res);
})();
