import { AccountsPlayers } from "@scobit/types";
import { Pool, PoolClient } from "pg";

export const saveNewAccountPlayerLink = async (accountPlayerLink:AccountsPlayers, pool:PoolClient) => {
  const result = await pool.query(
    `
      insert into accounts_players (
        account_id, player_id
      ) values (
        $1, $2 
      )
    `,
    [accountPlayerLink.account_id, accountPlayerLink.player_id]
  )
}