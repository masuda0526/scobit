import {z} from "zod";
import { AbstractEntitySchema } from "./Base/AbstractEntity";
import { TransactionEntitySchema } from "./Base/TransactionEntity";

// export type GameResultType = 'win' | 'lose' | 'draw' | 'nogame' | 'cold'
// export const GameResultConsts = [
//     'win', 'lose', 'draw', 'nogame', 'cold'
// ] as const

export const GameSchema = TransactionEntitySchema.extend({
    g_id:z.uuid(),
    t_id:z.uuid(),
    seq: z.number().int(),
    opponent: z.string(),
    my_point: z.number().int().min(0),
    op_point: z.number().int().min(0),
    // result: z.enum(GameResultConsts),
    g_dt:z.string().regex(/^\d{8}$/, 'yyyymmdd形式で入力してください。').refine(v => !isNaN(Date.parse(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`))),
})

export type Game = z.infer<typeof GameSchema>

export const GameDbSchema = GameSchema.extend({
    pk:z.string(), // t_id
    sk:z.string()  // GAME#{yyyymmdd}#{seq}
})
export type GameDb = z.infer<typeof GameDbSchema>