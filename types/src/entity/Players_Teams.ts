import z from "zod";

const PlayerRoleType = ['outer', 'member', 'admin'] as const
const StatusType = ['active', 'rest'] as const

export const PlayersTeamsSchema = z.object({
  player_id: z.uuid(),
  t_id: z.uuid(),
  role: z.enum(PlayerRoleType),
  status: z.enum(StatusType),
  del_flg: z.boolean().default(false),
  join_at: z.string().regex(/^\d{8}$/, 'yyyymmdd形式で入力してください。').refine(v => !isNaN(Date.parse(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`))),
  leave_at: z.string().regex(/^\d{8}$/, 'yyyymmdd形式で入力してください。').refine(v => !isNaN(Date.parse(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`)))
})

export type PlayersTeams = z.infer<typeof PlayersTeamsSchema>