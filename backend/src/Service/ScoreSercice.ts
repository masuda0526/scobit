import { GameForm, ScoreForm, ScoreItemDto, ScorePerPlayer } from "@scobit/types";
import { Pool, PoolClient } from "pg";
import { DateUtil } from "src/libs/DateUtil.js";
import { logger } from "src/libs/Logger/Logger.js";

type CreateDateStore = {
  player_id:string,
  created_at:Date
}

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

  static async findScoresByGameId(game_id:string, client:PoolClient):Promise<ScorePerPlayer[]>{
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
        s.game_id,
        p.disp_name,
        p.positions
      from scores s
      inner join players p on p.player_id = s.player_id
      where s.game_id = $1 
      ;  
    `, [game_id]);
    return result.rows;
  }

  static async saveScore(score:ScoreForm, game_id:string, client:PoolClient):Promise<ScoreForm>{
    const result = await client.query(`
      INSERT INTO public.scores
      (score_id, player_id, game_id, is_turn, box, hit, hr, steal, err, created_at, updated_at)
      VALUES(gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, now(), now())
      returning *;
      ;  
    `, [score.player_id, game_id, score.is_turn, score.box, score.hit, score.hr, score.steal, score.err]);
    return result.rows[0];
  }

  static async updateScoreForKojinAccount(
  score: ScoreForm,
  client: PoolClient
): Promise<ScoreForm> {
  const result = await client.query(
    `
    UPDATE scores
    SET
      player_id = $1,
      is_turn = $2,
      box = $3,
      hit = $4,
      hr = $5,
      steal = $6,
      err = $7,
      updated_at = now()
    WHERE score_id = $8
    RETURNING *;
    `,
    [
      score.player_id,
      score.is_turn,
      score.box,
      score.hit,
      score.hr,
      score.steal,
      score.err,
      score.score_id
    ]
  );

  return result.rows[0];
}

  static async updateScores(scores:ScoreForm[], game_id:string, client:PoolClient):Promise<ScoreForm[]>{
    const now = DateUtil.getSysDate();
    const items:any[] = [];
    const paramSql:string[] = []
    let i = 1;
    for(const score of scores){
      const params:string[] = []
      items.push(score.score_id);
      params.push(`$${i++}`)
      items.push(score.player_id);
      params.push(`$${i++}`)
      items.push(game_id);
      params.push(`$${i++}`)
      items.push(score.is_turn);
      params.push(`$${i++}`)
      items.push(score.box);
      params.push(`$${i++}`)
      items.push(score.hit);
      params.push(`$${i++}`)
      items.push(score.hr);
      params.push(`$${i++}`)
      items.push(score.steal);
      params.push(`$${i++}`)
      items.push(score.err);
      params.push(`$${i++}`)
      // const createdAt = createDates.find(d => d.player_id === score.player_id);
      // items.push(s);
      // params.push(`$${i++}`)
      items.push(now);
      params.push(`$${i++}`)
      paramSql.push(`( ${params.join(',')} )`);
    };
    
    const result = await client.query(`
  INSERT INTO scores
  (
    score_id,
    player_id,
    game_id,
    is_turn,
    box,
    hit,
    hr,
    steal,
    err,
    updated_at
  )
  VALUES ${paramSql.join(',')}
  
  ON CONFLICT (score_id)
  DO UPDATE SET
    player_id = EXCLUDED.player_id,
    game_id = EXCLUDED.game_id,
    is_turn = EXCLUDED.is_turn,
    box = EXCLUDED.box,
    hit = EXCLUDED.hit,
    hr = EXCLUDED.hr,
    steal = EXCLUDED.steal,
    err = EXCLUDED.err,
    updated_at = EXCLUDED.updated_at

  RETURNING *
`, items);

    return result.rows;
  }

  static async duplicateGameTeamOrAccountId(teamOrAccountId:string, game:GameForm, score:ScoreForm, client:PoolClient):Promise<number>{
    const result = await client.query(`
      select 1 from scores s join games g on s.game_id = g.game_id 
      where g.team_id = $1 
      and g.game_dt = $2 
      and g.seq = $3 
      and s.score_id <> $4 
      ;
    `, [teamOrAccountId, game.game_dt, game.seq, score.score_id]);
    return result.rows.length;
  }

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