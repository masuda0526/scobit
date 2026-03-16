import { Account, AccountsPlayers, Player } from "@scobit/types";

export const makePlayersAccount = (account:Account, player:Player):AccountsPlayers => {
  return {
    account_id:account.account_id,
    player_id: player.player_id
  }
}