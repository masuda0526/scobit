import z from "zod";

export const AccountsPlayersSchema = z.object({
  account_id: z.uuid(),
  player_id:z.uuid()
})

export type AccountsPlayers = z.infer<typeof AccountsPlayersSchema>