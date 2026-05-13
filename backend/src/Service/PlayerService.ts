import { Ability, Player } from "@scobit/types";
import { Pool, PoolClient } from "pg";

export class PlayerService {
  static async findPlayerAbilityByAccountId(account_id:string, client:PoolClient):Promise<Ability>{
    const result = await client.query(`
      select 
        p.player_id,
        p."name",
        p.disp_name,
        p.positions,
        p.throw_distance,
        pt.team_id,
        coalesce(SUM(s.hit), 0) as hit,
        coalesce(SUM(s.hr), 0) as hr,
        coalesce(SUM(s.steal), 0) as steal,

        coalesce(
          round(SUM(s.hit)::numeric / nullif(sum(s.box), 0), 3),
          0
        ) as avr,
        coalesce(	
          round(SUM(s.hr)::numeric / nullif(sum(s.box), 0), 3),
          0
        ) as hr_per_box,
        coalesce(
          round(SUM(s.err)::numeric / nullif(count(distinct s.game_id), 0), 3),
          0
        ) as err_per_game,
        coalesce(
          round(SUM(s.steal)::numeric / nullif(count(distinct s.game_id), 0), 3),
          0
        ) as steal_per_game

      from players p 
      join players_teams pt 
        on pt.player_id = p.player_id 
      join scores s 
        on s.player_id = p.player_id 
      join games g  
        on s.game_id = g.game_id 
        and g.team_id = pt.team_id 
      where pt.team_id = $1
      group by 
        p.player_id,
        p.name,
        p.disp_name,
        p.positions,
        p.throw_distance,
        pt.team_id
      ;
    `, [account_id]
    )
    return result.rows[0];
  }
}

export const findPlayersAbilittyByTeamId = async (team_id:string, pool:Pool):Promise<Ability[]> => {
  const result = await pool.query(
    buildAblitySql(),
    [team_id]
  )
  return result.rows;
}

export const findPlayerAbilitty = async (team_id:string, player_id:string, pool:Pool):Promise<Ability> => {
  const result = await pool.query(
    buildAblitySql(player_id),
    [team_id, player_id]
  )
  return result.rows[0]
}

const buildAblitySql = (player_id?:string) => {
  let whereSql = ` where pt.team_id = $1`
  if(player_id){
    whereSql = whereSql + ` and p.player_id = $2 `;
  }

  const sql = `
      select 
        p.player_id,
        p."name",
        p.disp_name,
        p.positions,
        p.throw_distance,
        pt.team_id,
        SUM(s.hit) as hit,
        SUM(s.hr) as hr,
        SUM(s.steal) as steal,
        coalesce(
          round(SUM(s.hit)::numeric / nullif(sum(s.box), 0), 3),
          0
        ) as avr,
        coalesce(	
          round(SUM(s.hr)::numeric / nullif(sum(s.box), 0), 3),
          0
        ) as hr_per_box,
        coalesce(
          round(SUM(s.err)::numeric / nullif(count(distinct s.game_id), 0), 3),
          0
        ) as err_per_game,
        coalesce(
          round(SUM(s.steal)::numeric / nullif(count(distinct s.game_id), 0), 3),
          0
        ) as steal_per_game
      from players p 
      join players_teams pt 
        on pt.player_id = p.player_id 
      join scores s 
        on s.player_id = p.player_id 
      join games g  
        on s.game_id = g.game_id 
        and g.team_id = pt.team_id 
      ${whereSql} 
      group by 
        p.player_id,
        p.name,
        p.disp_name,
        p.positions,
        p.throw_distance,
        pt.team_id
      ;
    `
  return sql;
}

export const saveNewPlayer = async (player:Player, pool:PoolClient) => {
  const result = await pool.query(
    `
      insert into players (
        player_id, name, disp_name, throw_distance, positions, created_at, updated_at
      ) values (
        $1, $2, $3, $4, $5, $6, $7 
      );
    `,
    [player.player_id, player.name, player.disp_name, player.throw_distance, player.positions, player.created_at, player.updated_at]
  )
}