import { Game, GameResultConsts, Team, Tournament } from "@scobit/types";
import { randomUUID } from "crypto";
import { randInt, randomDate } from "./util.js";

export const makeGame = (team:Team, tournament:Tournament):Game => {
  const now = new Date();
  const mypoint = randInt(0, 30);
  const oppoint = randInt(0, 30);
  let idx:number = 0;
  if(mypoint < oppoint){
    idx = 1;
  }else if(mypoint === oppoint){
    idx = 2;
  }
  // たまにノーゲーム
  if(randInt(0, 10) === 5){
    idx = 3
  }

  return {
    game_id:randomUUID(),
    team_id:team.team_id,
    seq:1,
    created_at:now,
    updated_at:now,
    tournament_id:tournament.tournament_id,
    opponent:`相手チーム${randInt(0, 100)}`,
    my_point:mypoint,
    op_point:oppoint,
    result:GameResultConsts[idx],
    game_dt:new Date(randomDate())
  }
}