import { getTeam } from "@func/team/index.js";
import { Router } from "src/Router/router.js";

export const router = new Router();

router.get('/team', getTeam);
