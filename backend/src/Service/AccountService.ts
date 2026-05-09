import { Account, AccountForm, ErrorInfo } from "@scobit/types";
import { Pool, PoolClient } from "pg";

export const findAccountByEmail = async (email:string, pool:Pool):Promise<Account[]> => {
  const result = await pool.query(
    `
      select
        a.account_id,
        a.account_pub_id,
        a.email,
        a.hash_pass,
        a.created_at,
        a.updated_at
      from account a
      where
        a.email = $1
    `,
    [email]
  )
  return result.rows;
}

export type DupulicateCheckResult = {
  isOk:boolean,
  errorInfo:ErrorInfo
}
export const isDupulicatePublicId = async(accountPublicId:string, pool:Pool):Promise<DupulicateCheckResult> => {
  const result = await pool.query(
    `select a.account_pub_id from account a where a.account_pub_id = $1; `, [accountPublicId]
  )
  const isOk = result.rows.length === 0;
  return {
    isOk,
    errorInfo:isOk?{field:'dummy', message:'dummy'}:{field:'account_pub_id', message:'ユーザーIDは使用できません。'}
  }
}
export const isDupulicateMail = async(email:string, pool:Pool):Promise<DupulicateCheckResult> => {
  const result = await pool.query(
    `select a.email from account a where a.email = $1; `, [email]
  )
  const isOk = result.rows.length === 0;
  return {
    isOk,
    errorInfo:isOk?{field:'dummy', message:'dummy'}:{field:'email', message:'メールアドレスは使用できません。'}
  }
}

export const saveNewAccount = async (account:Account, pool:PoolClient) => {
  const result = await pool.query(
    `
      insert into account (
        account_id, account_pub_id, email, hash_pass, created_at, updated_at
      ) values (
        $1, $2, $3, $4, $5, $6 
      ); 
    `,
    [account.account_id, account.account_pub_id, account.email, account.hash_pass, account.created_at, account.updated_at]
  );
}