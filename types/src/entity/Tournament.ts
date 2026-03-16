import z from "zod";
import { AbstractEntitySchema } from "./Base/AbstractEntity";

export const TournamentType = [
  'official',
  'league',
  'tournament',
  'practice',
  'intrasquad' //紅白戦
] as const;
export const TournamentSchema = AbstractEntitySchema.extend({
  tournament_id: z.uuid(),
  team_id: z.uuid(),
  name: z.string().min(1).max(30),
  type: z.enum(TournamentType),
  start_dt: z.coerce.date(),
  end_dt: z.coerce.date(),
})

export type Tournament = z.infer<typeof TournamentSchema>