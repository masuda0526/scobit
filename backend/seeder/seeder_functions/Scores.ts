import { Game, Player, Score } from "@scobit/types";
import { randomUUID } from "crypto";
import { randInt } from "./util.js";

export const makeScore = (player:Player, game:Game):Score => {
  const is_turn = randInt(0, 10)===5?false:true;
  const box = is_turn?randInt(0, 10):0;
  const hit = is_turn?randInt(0, box):0;
  const hr = is_turn?randInt(0, hit):0;
  const steal = is_turn?randInt(0, 3):0;
  const err = is_turn?randInt(0, 5):0;

  return {
    score_id:randomUUID(),
    player_id:player.player_id,
    is_turn,
    box,hit,hr,steal,err,
    game_id:game.game_id,
    created_at:game.game_dt,
    updated_at:game.game_dt
  }
}