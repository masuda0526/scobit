import z, { uuid } from "zod";
import { AbstractEntitySchema } from "./Base/AbstractEntity.js";
import { TransactionEntitySchema } from "./Base/TransactionEntity.js";

export const SlugSchema = TransactionEntitySchema.extend({
  alias_id: z.string().min(5).max(20),
  team_id: z.uuid()
})

export type Slug = z.infer<typeof SlugSchema>

export const SlugDbSchema = SlugSchema.extend({
  pk:z.string(),
  sk:z.string()
})

export type SlugDb = z.infer<typeof SlugDbSchema>