import {z} from 'zod'
import { AbstractEntitySchema } from './Base/AbstractEntity'
export const AbilitySchema = AbstractEntitySchema.extend({
  a_id: z.uuid(),                  // 能力ID
  t_id: z.uuid(),                  // ユーザーID
  avr: z.number().min(0).max(1),   // 打率
  hr_per_game: z.number(),         // 1試合あたりHR数
  steal_per_game: z.number(),      // 1試合あたり盗塁数
  err_per_game: z.number(),        // 1試合あたり失策数
  throw_distance: z.number(),      // 遠投距離（m）
  sprint_sec: z.number(),           // 50m走（秒）
  hr:z.number(),
  steal:z.number(),
  u_id:z.uuid(),
  disp_name: z.string(),
  user_name: z.string(),
  positions: z.string()
}) 

export type Ability = z.infer<typeof AbilitySchema>

export const AbilityDbSchema = AbilitySchema.extend({
  pk:z.string(), // t_id or u_id
  sk:z.string()  // MEMBER#{u_id} or ABILITY
})
export type AbilityDb = z.infer<typeof AbilityDbSchema>