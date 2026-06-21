import { ScobitFunction } from "@scobit/common";
import { GameForm } from "@scobit/types";
import { Pool, PoolClient } from "pg";
import { DateUtil } from "src/libs/DateUtil.js";
import { logger } from "src/libs/Logger/Logger";

export class GameService {
  static async findGamesByTeamId(team_id:string, pool:PoolClient, limit?:number):Promise<GameForm[]>{
    let limitSql = ''
    const params:any[] = [team_id]
  if(limit){
    limitSql = `limit $2 `
    params.push(limit);
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
    `, params
    // [team_id, limit]
  )
  return result.rows
  }

  static async findGamesForSameDate(team_id:string, gameDt:Date, client:PoolClient):Promise<GameForm[]>{
    const startDt = DateUtil.getStartDate(gameDt);
    const nextDt = DateUtil.getStartDate(DateUtil.addDate(gameDt, 1));
    const result = await client.query(`
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
      where g.team_id = $1 and
        $2 <= g.game_dt and g.game_dt < $3 
      ;
    `, [team_id, startDt, nextDt])
    return result.rows;
  }

  static async checkExistSameGame(team_id:string, gameDt:Date, seq:number,  client:PoolClient):Promise<boolean>{
    const games = await this.findGamesForSameDate(team_id, gameDt, client);

    for(const game of games){
      if(game.seq === seq){
        return false;
      }
    }
    return true;
  }

  static async saveNewGame(team_id:string, tournament_id:string, game:GameForm, client:PoolClient):Promise<GameForm>{
    const result = await client.query(`
      INSERT INTO public.games
      (game_id, team_id, tournament_id, seq, opponent, my_point, op_point, "result", game_dt, created_at, updated_at)
      VALUES(gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, now(), now())
      returning * ; 
    `, [team_id, tournament_id, game.seq, game.opponent, game.my_point, game.op_point, game.result, game.game_dt])

    return result.rows[0];
  }

  static async updateGame(game:GameForm, team_id:string, client:PoolClient):Promise<GameForm>{
    const result = await client.query(`
      UPDATE games
      SET team_id=$1, tournament_id=$2, seq=$3, opponent=$4, my_point=$5, op_point=$6, "result"=$7, game_dt=$8, updated_at=now()
      WHERE team_id=$1 and game_id = $9
      returning * ;
    `, [team_id, game.tournament_id, game.seq, game.opponent, game.my_point, game.op_point, ScobitFunction.getGameResult(game.my_point, game.op_point), game.game_dt, game.game_id])
    return result.rows[0];
  }

  static async findGameByGameIdAndTeamId(team_id:string, game_id:string, client:PoolClient):Promise<GameForm>{
    const result = await client.query(`
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
      where 
        g.team_id = $1 and
        g.game_id = $2 
      ; 
    `, [team_id, game_id])
    return result.rows[0];
  }

  static async overwriteAccountIdToTeamId(accountId:string, teamId:string, client:PoolClient):Promise<void>{
    const resultGame = await client.query(`
      update games 
      set team_id = $2
      where team_id = $1 
      returning * 
      ;
    `, [accountId, teamId]);

    // const resultScore = await client.query(`
    //   update scores 
    //   set team_id = $2
    //   where team_id = $1
    //   returning * 
    //   ;
    // `, [accountId, teamId]);
    
    logger.debug(`ゲーム情報更新完了`);
    logger.debugObj(resultGame.rows);

    // logger.debug(`スコア情報更新完了`);
    // logger.debugObj(resultScore.rows);
  }
}