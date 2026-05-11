import { mypageFetchTeams, mypageSelectTeam } from "@func/admin/mypage/index.js";
import { Router } from "src/Router/router.js";

export const adminRouter = new Router();

adminRouter.post('/mypage/teams', mypageFetchTeams);
adminRouter.post('/mypage/select', mypageSelectTeam);