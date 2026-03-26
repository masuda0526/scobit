import {string, uuid, z} from "zod";
import { AbstractEntitySchema } from "./Base/AbstractEntity.js";
import { TransactionEntitySchema } from "./Base/TransactionEntity.js";

export const UserSchema = TransactionEntitySchema.extend({
    u_id: z.uuid(),
    team_id: uuid(),
    name: z.string().min(1),
    disp_name: z.string().min(1).max(4),
    throw_distance: z.number().int().min(0),
    sprint_sec: z.number().min(0),
    positions: z.string().min(1).max(9),
    status:z.string(),
    delflg: z.boolean().default(false),
    renkei_id: z.string().optional(),
    auth: z.string().optional(),
    join_at: z.string().regex(/^\d{8}$/, 'yyyymmdd形式で入力してください。').refine(v => !isNaN(Date.parse(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`))),
})
export type User = z.infer<typeof UserSchema>

export const UserDbSchema = UserSchema.extend({
    pk:string(), // u_id
    sk:string()  // INFO
})
export type UserDb = z.infer<typeof UserDbSchema>