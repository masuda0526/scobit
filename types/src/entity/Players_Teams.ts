import {z} from "zod";

export const PlayerRoleType = ['guest', 'member', 'admin'] as const
export const StatusType = ['active', 'rest'] as const

export const PlayersTeamsSchema = z.object({
  player_id: z.uuid(),
  team_id: z.uuid(),
  role: z.enum(PlayerRoleType),
  status: z.enum(StatusType),
  del_flg: z.boolean().default(false),
  join_at: z.coerce.date(),
  leave_at: z.coerce.date().optional()
})

export type PlayersTeams = z.infer<typeof PlayersTeamsSchema>