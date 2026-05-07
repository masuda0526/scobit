import { Account, AccountForm } from "@scobit/types";
import { Pool } from "pg";

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