import { TeamForm } from "@scobit/types";
import { PoolClient } from "pg";
import { DateUtil } from "src/libs/DateUtil.js";

export type TeamFormHasRole = TeamForm & { role: string };

export class TeamService {
  static async findTeamByTeamId(team_id: string, client: PoolClient): Promise<TeamForm> {
    const result = await client.query(`
        select 
        t.team_id, 
        t.team_name, 
        t.pref, 
        t.area, 
        t.description,
        t.public_id 
      from teams t 
      where 
        t.team_id = $1;
    `, [team_id]);
    return result.rows[0];
  }
  static async findTeamsByAccountId(account_id: string, client: PoolClient): Promise<TeamFormHasRole[]> {
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

  /**
   * パブリックIDからチーム情報を取得します。
   * @param public_id 
   * @param pool 
   * @returns 
   */
  static async findTeamByPublicId(public_id: string, pool: PoolClient): Promise<TeamForm> {
    const result = await pool.query(
      `
        select 
          t.team_id, 
          t.team_name, 
          t.pref, 
          t.area, 
          t.description,
          t.public_id ,
        from teams t 
        where 
          t.public_id = $1;
      `,
      [public_id]
    );
    return result.rows[0] ?? null
  }

  static async saveTeamForm(inputTeam: TeamForm, client: PoolClient): Promise<TeamForm> {
    const now = DateUtil.getSysDate();

    const updates = [
      'public_id = $2',
      'team_name = $3',
      'pref = $4',
      'area = $5',
      'updated_at = $6'
    ];

    const params = [
      inputTeam.team_id,
      inputTeam.public_id,
      inputTeam.team_name,
      inputTeam.pref,
      inputTeam.area,
      now
    ];

    if (inputTeam.description !== undefined) {
      updates.push('description = $7');
      params.push(inputTeam.description);
    }

    const result = await client.query(`
      update teams
      set ${updates.join(', ')}
      where team_id = $1
      returning *
    `, params);
    return result.rows[0];
  }
}



export const isExistTeam = async (team_id: string, client: PoolClient) => {
  const result = await client.query(`
    select
      t.team_id
    from teams t
    where tt.team_id = $1
  `, [team_id])

  return result.rows.length > 0;
}