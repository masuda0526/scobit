import {z} from "zod";
import { AbstractEntitySchema } from "./Base/AbstractEntity.js";

export const PlayerSchema = AbstractEntitySchema.extend({
  player_id: z.uuid(),
  name: z.string().min(1).max(20),
  disp_name:z.string().min(1).max(4),
  throw_distance: z.number().int().min(0).max(200),
  positions: z.string().min(1).max(9).regex(/^[1-9]{1,9}$/)
})

export type Player = z.infer<typeof PlayerSchema>

export const PlayerFormSchema = PlayerSchema.omit({
  updated_at:true,
  created_at:true
})
export type PlayerForm = z.infer<typeof PlayerFormSchema>

export const PlayerInputSchema = z.object({
  throw_distance:z.string().max(3).min(1).default('0'),
  ...PlayerFormSchema.omit({
    throw_distance:true,
    player_id:true
  }).shape
})
export type PlayerInput = z.infer<typeof PlayerInputSchema>