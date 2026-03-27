import { TeamForm } from "@scobit/types";
import { Pool } from "pg";

/**
 * パブリックIDからチーム情報を取得します。
 * @param public_id 
 * @param pool 
 * @returns 
 */
export const findTeamByPublicId = async(public_id: string, pool: Pool):Promise<TeamForm> => {
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