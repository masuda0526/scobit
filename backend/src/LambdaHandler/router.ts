import { gameDetailPage } from "@func/game/index.js";
import { gamesPage } from "@func/games/index.js";
import { memberPage } from "@func/member/index.js";
import { memberGamesPage } from "@func/memberGames/index.js";
import { membersPage } from "@func/members/index.js";
import { getTeam } from "@func/team/index.js";
import { Router } from "src/Router/router.js";

export const router = new Router();

router.get('/team', getTeam);
router.get('/members', membersPage);
router.get('/member', memberPage);
router.get('/member/game', memberGamesPage);
router.get('/games', gamesPage);
router.get('/game/score', gameDetailPage);