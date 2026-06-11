import {z} from "zod";
import { AbstractEntitySchema } from "./Base/AbstractEntity.js";

export const AccountSchema = AbstractEntitySchema.extend({
  account_id: z.uuid(),
  account_pub_id: z.string().trim().min(5).max(20).regex(/^(?=.*[a-zA-Z])[a-zA-Z0-9][a-zA-Z0-9-]*$/),
  email: z.string().trim().toLowerCase().email(),
  hash_pass: z.string().max(255)
})

export type Account = z.infer<typeof AccountSchema>

export const AccountFormSchema = AccountSchema.pick({
  account_pub_id:true,
  email:true
})
export type AccountForm = z.infer<typeof AccountFormSchema>

export const AccountNewFormSchema = z.object({
  ...AccountSchema.pick({
    account_pub_id: true,
    email: true
  }).shape,
  pass:z.string().min(8).max(20)
})
export type AccountNewForm = z.infer<typeof AccountNewFormSchema>