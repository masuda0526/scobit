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

  static async findTournamentByTeamIdandTournamentId(team_id:string, tournament_id:string, client:PoolClient):Promise<Tournament>{
    const result = await client.query(`
      select * from tournament 
      where tournament_id = $1 and team_id = $2 ; 
    `, [tournament_id, team_id])
    return result.rows[0];
  }
}