import { PlayerRoleType, PlayersTeams, StatusType } from "@scobit/types";
import { PoolClient } from "pg";
import { DateUtil } from "src/libs/DateUtil.js";

type InitRole = typeof PlayerRoleType[number];
type InitStatus = typeof StatusType[number];

export class PlayersTeamsLinkService{

  static INIT_ROLE:InitRole = 'member';

  static INIT_STATUS:InitStatus = 'active';

  static async save(playerId:string, teamId:string, client:PoolClient):Promise<PlayersTeams>{
    const result = await client.query(`
      INSERT INTO players_teams
        (player_id, team_id, "role", status, del_flg, join_at) 
        VALUES($1, $2, $3, $4, $5, $6) 
        returning * 
      ;
    `, [playerId, teamId, this.INIT_ROLE, this.INIT_STATUS, false, DateUtil.getSysDate()])

    return result.rows[0];
  }
}