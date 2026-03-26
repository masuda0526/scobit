import {z} from 'zod'
import { PlayerFormSchema } from './Player.js'
import { TeamAbilitySchema } from './Team.js'

export const AbilitySchema = z.object({
  avr: z.number().min(0).max(1),   // 打率
  hr_per_box: z.number(),         // 1試合あたりHR数
  steal_per_game: z.number(),      // 1試合あたり盗塁数
  err_per_game: z.number(),        // 1試合あたり失策数
  hr:z.number(),
  steal:z.number(),
  ...PlayerFormSchema.shape,
  ...TeamAbilitySchema.shape,
})

export type Ability = z.infer<typeof AbilitySchema>

export const AbilityDbSchema = AbilitySchema.extend({
  pk:z.string(), // team_id or u_id
  sk:z.string()  // MEMBER#{u_id} or ABILITY
})
export type AbilityDb = z.infer<typeof AbilityDbSchema>