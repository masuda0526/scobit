import { ScoreItemDto } from "@scobit/types";
import { Pool } from "pg";

export const findScoresByPlayerId = async (player_id:string, pool:Pool, limit?:number):Promise<ScoreItemDto[]> => {
  const result = await pool.query(
    createSql(limit),
    [player_id, limit]
  )
  return result.rows;
}

const createSql = (limit?:number) => {
  let limitSql = '';
  if(limit){
    limitSql = 'limit $2 '
  }
  return `
      select 
        s.player_id,
        s.score_id,
        s.box,
        s.hit,
        s.hr,
        s.steal,
        s.err,
        s.is_turn,
        g.game_id,
        g.seq,
        g.tournament_id,
        g.opponent,
        g.my_point,
        g.op_point,
        g.result,
        g.game_dt
      from scores s 
      join games g on g.game_id = s.game_id  
      where s.player_id  = $1
      order by g.game_dt desc, g.seq asc 
      ${limitSql}
      ;
    `
}