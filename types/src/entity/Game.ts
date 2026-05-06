import {exactOptional, z} from "zod";
import { AbstractEntitySchema } from "./Base/AbstractEntity.js";

// export type GameResultType = 'win' | 'lose' | 'draw' | 'nogame' | 'cold'
export const GameResultConsts = [
    'win', 'lose', 'draw', 'no-game'
] as const

export const GameSchema = AbstractEntitySchema.extend({
    game_id:z.uuid(),
    team_id:z.uuid(),
    seq: z.number().int(),
    tournament_id: z.uuid({message:'大会情報を確認してください。'}),
    opponent: z.string().min(1, {message:'対戦相手は必須項目です。'}).max(50, {message:'50文字以内で入力してください。'}),
    my_point: z.number().int().min(0),
    op_point: z.number().int().min(0),
    result: z.enum(GameResultConsts),
    game_dt:z.coerce.date(),
})
export type Game = z.infer<typeof GameSchema>

export const GameFormSchema = GameSchema.omit({
    team_id: true,
    created_at:true,
    updated_at:true
})
export type GameForm = z.infer<typeof GameFormSchema>

export const GameDbSchema = GameSchema.extend({
    pk:z.string(), // team_id
    sk:z.string()  // GAME#{yyyymmdd}#{seq}
})
export type GameDb = z.infer<typeof GameDbSchema>