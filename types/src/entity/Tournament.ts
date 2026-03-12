import z from "zod";
import { AbstractEntitySchema } from "./Base/AbstractEntity";

const TournamentType = [
  'official',
  'league',
  'tournament',
  'practice',
  'intrasquad' //紅白戦
] as const;
const TournamentSchema = AbstractEntitySchema.extend({
  tournament_id: z.uuid(),
  t_id: z.uuid(),
  tournament_name: z.string().min(1).max(20),
  type: z.enum(TournamentType),
  start_dt: z.string().regex(/^\d{8}$/, 'yyyymmdd形式で入力してください。').refine(v => !isNaN(Date.parse(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`))),
  end_dt: z.string().regex(/^\d{8}$/, 'yyyymmdd形式で入力してください。').refine(v => !isNaN(Date.parse(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`))),
})