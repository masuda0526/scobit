import { Team, Tournament, TournamentType } from "@scobit/types";
import { randomUUID } from "crypto";
import { randInt } from "./util.js";

export const makeTournament = (team:Team):Tournament => {
  const now = new Date();
  return {
    tournament_id:randomUUID(),
    team_id:team.team_id,
    name:`テスト用大会${randInt(0, 100)}`,
    type:TournamentType[randInt(0,4)],
    start_dt:now,
    end_dt:now,
    created_at:now,
    updated_at:now,
  }
}