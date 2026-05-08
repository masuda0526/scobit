import { gameDetailPage } from "@func/public/game/index.js";
import { gamesPage } from "@func/public/games/index.js";
import { login } from "@func/public/login/index.js";
import { memberPage } from "@func/public/member/index.js";
import { memberGamesPage } from "@func/public/memberGames/index.js";
import { membersPage } from "@func/public/members/index.js";
import { registAccount } from "@func/public/NewAccount/index.js";
import { getTeam } from "@func/public/team/index.js";
import { Router } from "src/Router/router.js";

export const router = new Router();

router.get('/team', getTeam);
router.get('/members', membersPage);
router.get('/member', memberPage);
router.get('/member/game', memberGamesPage);
router.get('/games', gamesPage);
router.get('/game/score', gameDetailPage);
router.post('/login', login);
router.post('/new', registAccount);