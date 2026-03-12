import z from "zod";
import { AbstractEntitySchema } from "./Base/AbstractEntity";

export const AccountSchema = AbstractEntitySchema.extend({
  account_id: z.uuid(),
  account_pub_id: z.string().trim().toLowerCase().min(5).max(20).regex(/^(?=.*[a-z])[a-z0-9][a-z0-9-]*$/),
  email: z.string().trim().toLowerCase().email(),
  hass_pass: z.string().min(8),
})

export type Account = z.infer<typeof AccountSchema>
