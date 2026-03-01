import { z } from 'zod';

export type IntervalKey = "WEEK" | "MONTH" | "YEAR" | "OTHER"
export type IntervalItem = {
    val: string,
    label : string,
}
export const Intervals : Record<IntervalKey, IntervalItem> = {
    WEEK:{
        val:'WEEK',
        label:'毎週'
    },
    MONTH:{
        val:'MONTH',
        label:'毎月'
    },
    YEAR:{
        val:'YEAR',
        label:'毎年'
    },
    OTHER:{
        val:'OTHER',
        label:'その他'
    }
} as const;
const intervalValues = [
    "WEEK", "MONTH", "YEAR", "OTHER"
] as const;

export type ActiveInfoItem = {
    val:string,
    label:string
}
export const ActiveInfo:Record<IntervalKey, ActiveInfoItem[]>  = {
    WEEK:[
        {val:'sun', label:'日曜日'},
        {val:'mon', label:'月曜日'},
        {val:'tue', label:'火曜日'},
        {val:'wed', label:'水曜日'},
        {val:'thr', label:'木曜日'},
        {val:'fri', label:'金曜日'},
        {val:'sat', label:'土曜日'},
        {val:'end', label:'末'},
        {val:'one', label:'1回'},
        {val:'few', label:'2~3回'},
        {val:'many', label:'数回'},
        {val:'noplan', label:'不定期'}
    ],
    MONTH:[
        {val:'start', label:'初め'},
        {val:'end', label:'末'},
        {val:'one', label:'1回'},
        {val:'few', label:'2~3回'},
        {val:'many', label:'数回'},
        {val:'noplan', label:'不定期'}
    ],
    YEAR:[
        {val:'one', label:'1回'},
        {val:'few', label:'2~3回'},
        {val:'many', label:'数回'},
        {val:'noplan', label:'不定期'}
    ],
    OTHER:[
        {val:'other', label:'その他'}
    ]
}
export const TeamSchema = z.object({
    t_id: z.uuid(),
    teamName: z.string().min(1).max(30),
    area:z.string().min(1).max(50),
    interval:z.enum(intervalValues),
    activeInfo:z.array(z.string()),
    createdDt: z.string().regex(/^\d{8}$/, 'yyyymmdd形式で入力してください。').refine(v => !isNaN(Date.parse(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`))),
    registeredDt: z.string().regex(/^\d{8}$/, 'yyyymmdd形式で入力してください。').refine(v => !isNaN(Date.parse(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`))),
    description: z.string().max(100).optional(),
    payMode: z.number().int().min(0).max(2).default(0),
    leaderName: z.string().min(1).max(10),
    icon: z.string().optional()
}).superRefine((data, ctx) => {
    if(!isInclude(data.interval, data.activeInfo)){
        ctx.addIssue({
            code:'custom',
            message:'不正な値が入力されました。',
            path:['activeInfo']
        })
    }
})

export type Team = z.infer<typeof TeamSchema>;

const isInclude = (interval:IntervalKey, items:string[]) => {
    const targets = ActiveInfo[interval].map(obj => obj.val);
    return items.every(v => targets.includes(v));
}

export const TeamDbSchema = TeamSchema.extend({
    pk:z.string(), // t_id
    sk:z.string() // INFO
})
export type TeamDb = z.infer<typeof TeamDbSchema>