import { AdminGameInit } from "@func/admin/game/index.js";
import { AdminGameEditInit, editGame, editScores } from "@func/admin/gameEdit/index.js";
import { AddNewGame, AdminGamesInit } from "@func/admin/Games/index.js";
import { AdminMemberInit, updateMember } from "@func/admin/member/index.js";
import { AdminMembersInit, MembersAddMember } from "@func/admin/members/index.js";
import { mypageFetchKojinData, mypageFetchTeams, mypageSelectTeam } from "@func/admin/mypage/index.js";
import { AdminTeamInit, updateTeamInfo } from "@func/admin/team/index.js";
import { Router } from "src/Router/router.js";

export const adminRouter = new Router();

adminRouter.post('/mypage/teams', mypageFetchTeams);
adminRouter.post('/mypage/select', mypageSelectTeam);
adminRouter.post('/mypage/kojin', mypageFetchKojinData);
adminRouter.post('/team/init', AdminTeamInit);
adminRouter.post('/team/update', updateTeamInfo);
adminRouter.post('/members/init', AdminMembersInit);
adminRouter.post('/members/add', MembersAddMember);
adminRouter.post('/member/init', AdminMemberInit);
adminRouter.post('/member/update', updateMember);
adminRouter.post('/games/init', AdminGamesInit);
adminRouter.post('/games/new', AddNewGame);
adminRouter.post('/game/init', AdminGameInit);
adminRouter.post('/game/edit/init', AdminGameEditInit);
adminRouter.post('/game/edit/update', editGame);
adminRouter.post('/scores/update', editScores);