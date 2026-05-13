import { GameForm } from "@scobit/types";
import { Pool, PoolClient } from "pg";

export class GameService {
  static async findGamesByTeamId(team_id:string, pool:PoolClient, limit?:number):Promise<GameForm[]>{
    let limitSql = ''
  if(limit){
    limitSql = `limit $2 `
  }
  const result = await pool.query(
    `
      select 
        g.game_id, 
        g.seq, 
        g.tournament_id, 
        g.opponent, 
        g.my_point, 
        g.op_point, 
        g."result", 
        g.game_dt
      from games g 
      where g.team_id = $1 
      order by g.game_dt desc, g.seq asc 
      ${limitSql}
      ;
    `,
    [team_id, limit]
  )
  return result.rows
  }
}

export const findGameByGameId = async (game_id:string, pool:PoolClient):Promise<GameForm> => {
  const result = await pool.query(
    `
      select
        g.game_id, 
        g.seq ,
        g.tournament_id ,
        g.opponent ,
        g.my_point ,
        g.op_point ,
        g."result" ,
        g.game_dt 
      from games g 
      where g.game_id = $1
      ;
    `,
    [game_id]
  )
  return result.rows[0];
}