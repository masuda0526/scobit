import { mypageFetchKojinData, mypageFetchTeams, mypageSelectTeam } from "@func/admin/mypage/index.js";
import { AdminTeamInit, updateTeamInfo } from "@func/admin/team/index.js";
import { Router } from "src/Router/router.js";

export const adminRouter = new Router();

adminRouter.post('/mypage/teams', mypageFetchTeams);
adminRouter.post('/mypage/select', mypageSelectTeam);
adminRouter.post('/mypage/kojin', mypageFetchKojinData);
adminRouter.post('/team/init', AdminTeamInit);
adminRouter.post('/team/update', updateTeamInfo);