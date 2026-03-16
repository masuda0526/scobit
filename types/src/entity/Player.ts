import z from "zod";
import { AbstractEntitySchema } from "./Base/AbstractEntity";

export const PlayerSchema = AbstractEntitySchema.extend({
  player_id: z.uuid(),
  name: z.string().min(1).max(20),
  disp_name:z.string().min(1).max(4),
  throw_distance: z.number().int().min(0).max(200),
  positions: z.string().min(1).max(9).regex(/^[1-9]{1,9}$/)
})

export type Player = z.infer<typeof PlayerSchema>