import {z} from 'zod'
export const AbilitySchema = z.object({
  a_id: z.uuid(),                  // 能力ID
  t_id: z.uuid(),                  // ユーザーID
  avr: z.number().min(0).max(1),   // 打率
  hr_per_game: z.number(),         // 1試合あたりHR数
  steal_per_game: z.number(),      // 1試合あたり盗塁数
  err_per_game: z.number(),        // 1試合あたり失策数
  throw_distance: z.number(),      // 遠投距離（m）
  sprint_sec: z.number()           // 50m走（秒）
}) 

export type Ability = z.infer<typeof AbilitySchema>
