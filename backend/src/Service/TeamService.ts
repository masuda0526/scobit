import { TeamForm } from "@scobit/types";
import { Client, Pool, PoolClient } from "pg";

export type TeamFormHasRole = TeamForm & {role:string};

/**
 * パブリックIDからチーム情報を取得します。
 * @param public_id 
 * @param pool 
 * @returns 
 */
export const findTeamByPublicId = async (public_id: string, pool: Pool): Promise<TeamForm> => {
  const result = await pool.query(
    `
      select 
        t.team_id, 
        t.team_name, 
        t.pref, 
        t.area, 
        t.description,
        t.public_id 
      from teams t 
      where 
        t.public_id = $1;
    `,
    [public_id]
  );
  return result.rows[0] ?? null
}

export const findTeamsByAccountId = async (account_id: string, client: PoolClient): Promise<TeamFormHasRole[]> => {
  const result = await client.query(
    `
      select
        t.team_id, 
        t.team_name, 
        t.pref, 
        t.area, 
        t.description,
        t.public_id,
        pt.role
      from teams t 
      join players_teams pt on pt.team_id = t.team_id 
      join accounts_players ap on ap.player_id = pt.player_id 
      join account a  on a.account_id = ap.account_id
      where a.account_id = $1 ; 
    `
    , [account_id]
  )
  return result.rows;
}

export const isExistTeam = async(team_id:string, client:PoolClient) => {
  const result = await client.query(`
    select
      t.team_id
    from teams t
    where tt.team_id = $1
  `, [team_id])

  return result.rows.length > 0;
}