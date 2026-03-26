import { Pool } from "pg";
import { env } from "../EnvPropertyUtil/Env.js";
import { logger } from "../Logger/Logger.js";

let pool : Pool;
const RDB_ENDPOINT = `postgres://${env.RDB_USER}:${env.RDB_PASS}@${env.RDB_HOST}:${env.RDB_PORT}/${env.RDB_NAME}`;
logger.debug(`RDB_Path:${RDB_ENDPOINT}`);

export const getPool = () => {
  if(!pool){
    pool = new Pool({
      connectionString: RDB_ENDPOINT,
      ssl:env.STAGE === 'local'?false:{
        rejectUnauthorized:false
      }
    })
  }
  return pool;
}