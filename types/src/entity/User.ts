import {string, uuid, z} from "zod";

export const UserSchema = z.object({
    u_id: z.uuid(),
    t_id: uuid(),
    name: z.string().min(1),
    disp_name: z.string().min(1).max(4),
    throw_distance: z.number().int().min(0),
    sprint_sec: z.number().min(0),
    pos: z.string().min(1).max(9),
    status:z.string(),
    delflg: z.boolean().default(false),
    renkei_id: z.string().optional(),
    auth: z.string().optional(),
    created_at: z.string().regex(/^\d{8}$/, 'yyyymmdd形式で入力してください。').refine(v => !isNaN(Date.parse(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`))),
    updated_at: z.string().regex(/^\d{8}$/, 'yyyymmdd形式で入力してください。').refine(v => !isNaN(Date.parse(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`))),
    join_at: z.string().regex(/^\d{8}$/, 'yyyymmdd形式で入力してください。').refine(v => !isNaN(Date.parse(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`))),
})

export type User = {
    u_id: string;
    t_id: string;
    name: string;
    disp_name: string;
    throw_distance: number;
    sprint_sec: number;
    pos: string;
    status: string;
    delflg: boolean;
    renkei_id: string;
    auth: string;
    created_at: Date;
    updated_at: Date;
}
