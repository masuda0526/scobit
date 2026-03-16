import { Player, PlayerRoleType, PlayersTeams, StatusType, Team } from "@scobit/types";
import { randInt } from "./util.js";

export const makePlayersTeams = (player:Player, team:Team):PlayersTeams => {
  const now = new Date();
  return {
    player_id:player.player_id,
    team_id:team.team_id,
    role:PlayerRoleType[randInt(0, 2)],
    status:StatusType[randInt(0, 1)],
    del_flg:false,
    join_at:now,
  }
}