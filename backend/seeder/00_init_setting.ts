import { PoolConfig } from "pg"

export const awsConfig = {
  AWS_REGION:'ap-northeast-1',
  AWS_ENDPOINT:'http://localhost:28000',
  AWS_ACCESS_KEY_ID :'dummy',
  AWS_SECRET_ACCESS_KEY:'dummy',
  AWS_TABLE:'scobit_dev'
}

export const localDbConfig:PoolConfig = {
  host:'localhost',
  port: 15432,
  user: 'dev',
  password: 'dev',
  database: 'scobit_dev'
}