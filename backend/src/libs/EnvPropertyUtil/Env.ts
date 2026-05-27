import dotenv from 'dotenv';
import z from 'zod';


if (process.env.NODE_ENV !== 'production') {
  const env = process.env.NODE_ENV || 'local';
  dotenv.config({ path: `.env.${env}` });
}

const EnvSchema = z.object({
  STAGE: z.enum(['local', 'dev', 'product', 'stage']),
  LOG_LEVEL: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']),
  JWT_SECRET_KEY: z.string().min(10),
  RDB_NAME: z.string(),
  RDB_HOST: z.string(),
  RDB_PORT: z.string(),
  RDB_USER: z.string(),
  RDB_PASS: z.string(),
  DB_TABLE: z.string(),
  AWS_REGION: z.string(),
  DYNAMO_ENDPOINT: z.string()
})

export const env = EnvSchema.parse(process.env);