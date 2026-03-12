import { z } from 'zod';
import { AbstractEntitySchema } from './Base/AbstractEntity';

export const ScoreSchema = AbstractEntitySchema.extend({
    // インデックス用
    s_id: z.uuid(),
    p_id: z.uuid(),
    g_id: z.uuid().optional(), // バックエンドで付与。更新の場合はフロントからくる
    // 成績
    isTurn: z.boolean(),
    box: z.number().int().min(0).default(0),
    hit: z.number().int().min(0).default(0),
    hr: z.number().int().min(0).default(0),
    steal: z.number().int().min(0).default(0),
    err: z.number().int().min(0).default(0),
    // 試合情報
    // g_dt: z.string().regex(/^\d{8}$/, "yyyymmdd形式で入力してください。").refine(v => !isNaN(Date.parse(
    //     `${v.slice(0,4)}-${v.slice(4,6)}-${v.slice(6,8)}`
    // )), "存在しない日付です。"), // yyyymmdd形式
    // seq: z.number().int().min(1).default(1), // 一日に複数試合があった場合増加
    // opponent: z.string().min(1),
    // // 選手表示用
    // disp_name:z.string().min(1).max(4),
    // positions:z.string().min(1).max(9)
}).superRefine((data, ctx) => {
    // 出番があった場合は以下のバリデーションを構築
    if (data.isTurn) {
        if (data.box < data.hit) {
            ctx.addIssue({
                code: "custom",
                message: "ヒット数が打席数を超えています。",
                path: ["hit"]
            })
        }
        if (data.hit < data.hr) {
            ctx.addIssue({
                code: "custom",
                message: "ホームラン数はヒット数の内数を入力してください。",
                path: ["hr"]
            })
        }
    }
});

export type Score = z.infer<typeof ScoreSchema>

export const ScoreDbSchema = ScoreSchema.extend({
    pk:z.string(), // g_id or u_id
    sk:z.string()  // SCORE#{u_id} or SCORE#{yyyymmdd}#n
})

export type ScoreDb = z.infer<typeof ScoreDbSchema>