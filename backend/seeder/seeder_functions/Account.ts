import { Account } from "@scobit/types";
import { randomUUID } from "crypto";
import { createRandomAlias, randInt } from "./util.js";
import { PoolClient } from "pg";

export const makeAccount = ():Account => {
  const account_pub_id = createRandomAlias(randInt(5, 20))
  return {
    account_id:randomUUID(),
    account_pub_id,
    email:`mail_${account_pub_id}@test.com`,
    hash_pass: 'dummy',
    created_at: new Date(),
    updated_at: new Date(),
  }
}

export const insertAccounts = async (client:PoolClient, accounts:Account[]) => {
  for (const acc of accounts) {

  await client.query(
    `
    INSERT INTO account
    (account_id, account_pub_id, email, hash_pass, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6)
    `,
    [
      acc.account_id,
      acc.account_pub_id,
      acc.email,
      acc.hash_pass,
      acc.created_at,
      acc.updated_at
    ]
  );
}
}