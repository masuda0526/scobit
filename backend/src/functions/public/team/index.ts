import { APIGatewayProxyEvent } from "aws-lambda";
import { ResponseBodyBuilder } from "../../../libs/ResponseUtil/ResponseBuilder.js";
import { logger } from "src/libs/Logger/Logger.js";
import { getPool } from "src/libs/SqlUtil/SqlUtil.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";
import { GameForm, PlayerForm, TeamForm, TeamSchema, TeamTopForm } from "@scobit/types";
import { Pool } from "pg";

export const getTeam = async (event: APIGatewayProxyEvent): Promise<ResponseBodyBuilder> => {
  logger.info(`チーム情報取得処理開始`);
  const param = event.pathParameters;
  const public_id = param?.public_id;
  logger.debug(`public_id : ${public_id}`);

  if (!validTeamId(public_id ?? '')) {
    return ResponseUtil.error().addError('public_id', 'チームが存在しません。');
  }
  logger.info('バリデーションOK');

  const pool = getPool();

  const info: TeamForm = await findTeamByPublicId(public_id!, pool);
  if(!info){
    return ResponseUtil.error().addError('public_id', 'チームが存在しません。')
  }
  logger.info('チーム情報取得');

  const [games, players] = await Promise.all([
    findGamesByPublicId(info.team_id, pool),
    findPlayersByPublicId(info.team_id, pool)
  ])
  logger.info('情報取得完了');

  const result: TeamTopForm = {
    info, games, players
  }
  logger.debugObj(result)

  const res = ResponseUtil.success().putData('data', result);

  return res;

}


const schema = TeamSchema.pick({
  public_id: true
})

function validTeamId(public_id: string) {
  return schema.safeParse({ public_id }).success;
}

async function findTeamByPublicId(public_id: string, pool: Pool) {
  const result = await pool.query(
    `
      select 
        t.team_id, 
        t.team_name, 
        t.pref, 
        t.area, 
        t.description 
      from teams t 
      where 
        t.public_id = $1;
    `,
    [public_id]
  );
  return result.rows[0] ?? null
}

async function findGamesByPublicId(team_id: string, pool: Pool):Promise<GameForm[]> {
  const result = await pool.query(
    `
      select 
        g.game_id, 
        g.seq, 
        g.tournament_id, 
        g.opponent, 
        g.my_point, 
        g.op_point, 
        g.result,
        g.game_dt 
      from games g 
      where g.team_id = $1
      order by g.game_dt desc
      limit 5
      ;
    `,
    [team_id]
  )
  return result.rows;
}

async function findPlayersByPublicId (team_id:string, pool:Pool):Promise<PlayerForm[]>{
  const result = await pool.query(
    `
      select 
        p.player_id,
        p.name,
        p.disp_name,
        p.throw_distance,
        p.positions
      from players p  
      join players_teams pt on pt.player_id = p.player_id
      where pt.team_id = $1
      ;
    `,
    [team_id]
  )
  return result.rows;
}