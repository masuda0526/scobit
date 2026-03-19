import { z } from 'zod';
import { AbstractEntitySchema } from './Base/AbstractEntity';

export const prefArray = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",

  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",

  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",

  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",

  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",

  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",

  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",

  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",

  "沖縄県"
] as const;

// export type IntervalKey = "WEEK" | "MONTH" | "YEAR" | "OTHER"
// export type IntervalItem = {
//     val: string,
//     label : string,
// }
// export const Intervals : Record<IntervalKey, IntervalItem> = {
//     WEEK:{
//         val:'WEEK',
//         label:'毎週'
//     },
//     MONTH:{
//         val:'MONTH',
//         label:'毎月'
//     },
//     YEAR:{
//         val:'YEAR',
//         label:'毎年'
//     },
//     OTHER:{
//         val:'OTHER',
//         label:'その他'
//     }
// } as const;
// const intervalValues = [
//     "WEEK", "MONTH", "YEAR", "OTHER"
// ] as const;

// export type ActiveInfoItem = {
//     val:string,
//     label:string
// }
// export const ActiveInfo:Record<IntervalKey, ActiveInfoItem[]>  = {
//     WEEK:[
//         {val:'sun', label:'日曜日'},
//         {val:'mon', label:'月曜日'},
//         {val:'tue', label:'火曜日'},
//         {val:'wed', label:'水曜日'},
//         {val:'thr', label:'木曜日'},
//         {val:'fri', label:'金曜日'},
//         {val:'sat', label:'土曜日'},
//         {val:'end', label:'末'},
//         {val:'one', label:'1回'},
//         {val:'few', label:'2~3回'},
//         {val:'many', label:'数回'},
//         {val:'noplan', label:'不定期'}
//     ],
//     MONTH:[
//         {val:'start', label:'初め'},
//         {val:'end', label:'末'},
//         {val:'one', label:'1回'},
//         {val:'few', label:'2~3回'},
//         {val:'many', label:'数回'},
//         {val:'noplan', label:'不定期'}
//     ],
//     YEAR:[
//         {val:'one', label:'1回'},
//         {val:'few', label:'2~3回'},
//         {val:'many', label:'数回'},
//         {val:'noplan', label:'不定期'}
//     ],
//     OTHER:[
//         {val:'other', label:'その他'}
//     ]
// }
export const TeamSchema = AbstractEntitySchema.extend({
    team_id: z.uuid(),
    public_id: z.string().min(5).max(20).regex(/^[a-zA-Z][0-9a-zA-Z_-]+$/),
    team_name: z.string().min(1).max(50),
    // interval:z.enum(intervalValues),
    // activeInfo:z.array(z.string()),
    regist_at: z.coerce.date(),
    description: z.string().max(100).optional(),
    leader_id:z.uuid(),
    icon: z.string().optional(),
    pref: z.enum(prefArray),
    area:z.string().min(1).max(50),
})
// .superRefine((data, ctx) => {
//     if(!isInclude(data.interval, data.activeInfo)){
//         ctx.addIssue({
//             code:'custom',
//             message:'不正な値が入力されました。',
//             path:['activeInfo']
//         })
//     }
// })

export type Team = z.infer<typeof TeamSchema>;

// const isInclude = (interval:IntervalKey, items:string[]) => {
//     const targets = ActiveInfo[interval].map(obj => obj.val);
//     return items.every(v => targets.includes(v));
// }

export const TeamFormSchema = TeamSchema.pick({
  team_id:true,
  team_name:true,
  description:true,
  pref:true,
  area:true,
  created_at:true,
})
export type TeamForm = z.infer<typeof TeamFormSchema>

export const TeamAbilitySchema = TeamSchema.pick({
  team_id:true
})

export const TeamDbSchema = TeamSchema.extend({
    pk:z.string(), // team_id
    sk:z.string() // INFO
})
export type TeamDb = z.infer<typeof TeamDbSchema>