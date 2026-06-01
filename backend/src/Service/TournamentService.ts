import { Tournament } from "@scobit/types";
import { PoolClient } from "pg";
import { logger } from "src/libs/Logger/Logger";

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

  static async registDefaultTournament(team_id:string, client:PoolClient):Promise<void>{
    const endDate = new Date(9999, 12, 31, 23, 59, 59);
    const result = await client.query(`
      INSERT INTO public.tournament
      (tournament_id, team_id, "name", "type", start_dt, end_dt, created_at, updated_at)
      VALUES
      (gen_random_uuid(), $1, '公式戦', 'official', now(), $2, now(), now()),
      (gen_random_uuid(), $1, '練習試合', 'practice', now(), $2, now(), now())
      ;  
    `, [team_id, endDate]);
    logger.debugObj(result.rows);
  }
}