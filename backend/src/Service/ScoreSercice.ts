import { ScoreItemDto, ScorePerPlayer } from "@scobit/types";
import { Pool, PoolClient } from "pg";

export class ScoreService{
  static async findScoresByAccountId(accountId:string, limit:number, client:PoolClient):Promise<ScoreItemDto[]>{
    const result = await client.query(`
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
      where g.team_id = $1
      order by g.game_dt desc, g.seq asc
      limit $2 
    `, [accountId, limit])
    return result.rows
  }

  static async findScoresByPlayerId(player_id:string, pool:PoolClient, limit?:number):Promise<ScoreItemDto[]>{
    const result = await pool.query(
      createSql(limit),
      [player_id, limit]
    )
    return result.rows;
  }

}


export const findScoresByGameId = async (game_id:string, pool:PoolClient):Promise<ScorePerPlayer[]> =>{
  const result = await pool.query(
    `
      select
        s.score_id ,
        s.is_turn ,
        s.box ,
        s.hit ,
        s.hr ,
        s.steal ,
        s.err ,
        p.disp_name , 
        p.positions ,
        s.game_id 
      from scores s 
      join players p on p.player_id = s.player_id
      where s.game_id = $1
      ;
    `,
    [game_id]
  )
  return result.rows
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