import { getTeamController } from "src/Controller/GetTeam/GetTeamController.js";
import { Router } from "src/Router/router.js";

export const router = new Router();

router.get('/team', getTeamController);
