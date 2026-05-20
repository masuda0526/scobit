import { ScoreForm, ScoreItemDto, ScorePerPlayer } from "@scobit/types";
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

  static async updateScores(scores:ScoreForm[], game_id:string, client:PoolClient):Promise<ScoreForm[]>{
    const now = DateUtil.getSysDate();
    // const getCreateDtResult = await client.query(`
    //   select s.player_id, s.created_at from scores s
    //   where s.game_id = $1 
    //   ;
    // `, [game_id])
    // const createDates:CreateDateStore[] = getCreateDtResult.rows;
    // logger.debug('作成日時の取得完了');
    // logger.debugObj(createDates);

    // const deleteResult = await client.query(`
    //   delete from scores 
    //   where game_id = $1
    //   ;
    // `, [game_id]);
    // logger.info(`削除処理完了 削除件数：${deleteResult.rowCount}件 成績数：${scores.length}件 一時保存済みの作成日時件数：${createDates.length}件`)

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