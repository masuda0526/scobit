import { Account, AccountForm, ErrorInfo } from "@scobit/types";
import { PoolClient } from "pg";

export type DupulicateCheckResult = {
  isOk: boolean,
  errorInfo: ErrorInfo
}

export class AccountService {
  static async findAccountFormByAccountId(accountId: string, client: PoolClient): Promise<AccountForm> {
    const result = await client.query(
      `
        select
          a.account_pub_id,
          a.email
        from account a
        where
          a.account_id = $1
      `, [accountId]
    )
    return result.rows[0];
  }

  static async findAccountByEmail(email: string, pool: PoolClient): Promise<Account[]> {
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
  static async isDupulicatePublicId(accountPublicId: string, pool: PoolClient): Promise<DupulicateCheckResult> {
    const result = await pool.query(
      `select a.account_pub_id from account a where a.account_pub_id = $1; `, [accountPublicId]
    )
    const isOk = result.rows.length === 0;
    return {
      isOk,
      errorInfo: isOk ? { field: 'dummy', message: 'dummy' } : { field: 'account_pub_id', message: 'ユーザーIDは使用できません。' }
    }
  }

  static async isDupulicateMail(email: string, pool: PoolClient): Promise<DupulicateCheckResult> {
    const result = await pool.query(
      `select a.email from account a where a.email = $1; `, [email]
    )
    const isOk = result.rows.length === 0;
    return {
      isOk,
      errorInfo: isOk ? { field: 'dummy', message: 'dummy' } : { field: 'email', message: 'メールアドレスは使用できません。' }
    }
  }
  
  static async saveNewAccount(account: Account, pool: PoolClient){
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

  static async updateAccount(account: AccountForm, accountId:string, pool: PoolClient):Promise<AccountForm>{
    const result = await pool.query(
      `
        UPDATE account SET account_pub_id=$1, email=$2, updated_at = now() WHERE account_id=$3
        returning account_pub_id, email ;
      `,
      [account.account_pub_id, account.email, accountId]
    );
    return result.rows[0];
  }

  static async getCountForPublicIdExcludeAccountId(publicId:string, accountId:string, client: PoolClient):Promise<number>{
    const result = await client.query(`
        select 1 from account where account_pub_id = $1 and account_id<>$2;
      `, [publicId, accountId]);
    return result.rows.length;
  }

  static async getCountForEmailExcludeAccountId(email:string, accountId:string, client: PoolClient):Promise<number>{
    const result = await client.query(`
        select 1 from account where email = $1 and account_id<>$2;
      `, [email, accountId]);
    return result.rows.length;
  }
}


