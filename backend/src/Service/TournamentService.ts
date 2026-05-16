import { Tournament } from "@scobit/types";
import { PoolClient } from "pg";

export class TournamentService{
  static async findTournamentsByTeamId(team_id:string, client:PoolClient):Promise<Tournament[]>{
    const result = await client.query(`
      SELECT tournament_id, team_id, "name", "type", start_dt, end_dt, created_at, updated_at
      FROM public.tournament
      where team_id = $1;
    `, [team_id]);
    return result.rows;
  }
}