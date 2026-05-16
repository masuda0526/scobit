import { Ability, Player, PlayerForm } from "@scobit/types";
import { Pool, PoolClient } from "pg";
import { DateUtil } from "src/libs/DateUtil.js";

export class PlayerService {
  static async findPlayerAbilityByAccountId(account_id: string, client: PoolClient): Promise<Ability> {
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

  static async findPlayersAbilittyByTeamId(team_id: string, pool: PoolClient): Promise<Ability[]> {
    const result = await pool.query(
      buildAblitySql(),
      [team_id]
    )
    return result.rows;
  }

  static async saveNewPlayer(player: PlayerForm, pool: PoolClient): Promise<Player> {
    const result = await pool.query(
      `
      insert into players (
        player_id, name, disp_name, throw_distance, positions, created_at, updated_at
      ) values (
        $1, $2, $3, $4, $5, now(), now() 
      )
      returning * 
      ;
    `,
      [player.player_id, player.name, player.disp_name, player.throw_distance, player.positions]
    )
    return result.rows[0];
  }

  static async findPlayerAbilitty(team_id: string, player_id: string, pool: PoolClient): Promise<Ability> {
    const result = await pool.query(
      buildAblitySql(player_id),
      [team_id, player_id]
    )
    return result.rows[0]
  }

  static async findPlayerByTeamIdAndPlayerId(team_id: string, player_id: string, client: PoolClient): Promise<PlayerForm> {
    const result = await client.query(`
        select p.player_id, p.name, p.disp_name, p.throw_distance, p.positions from players p 
        join players_teams pt on pt.player_id = p.player_id
        where pt.team_id = $1 and p.player_id = $2 ; 
      `, [team_id, player_id]);

    return result.rows[0];
  }

  static async updatePlayer(player: PlayerForm, client: PoolClient): Promise<PlayerForm> {
    const result = await client.query(`
      UPDATE players 
      SET "name"=$1, disp_name=$2, throw_distance=$3, positions=$4, updated_at=$5 
      WHERE player_id=$6 
      returning * ;
    `, [player.name, player.disp_name, player.throw_distance, player.positions, DateUtil.getSysDate(), player.player_id]);

    return result.rows[0];
  }

}


const buildAblitySql = (player_id?: string) => {
  let whereSql = ` where pt.team_id = $1`
  if (player_id) {
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
      left join scores s 
        on s.player_id = p.player_id 
      left join games g  
        on s.game_id = g.game_id 
        and g.team_id = pt.team_id 
      ${whereSql} 
      group by 
        p.player_id,
        p.name,
        p.disp_name,
        p.positions,
        p.throw_distance,
        pt.team_id,
        p.created_at
      order by p.created_at
      ;
    `
  return sql;
}