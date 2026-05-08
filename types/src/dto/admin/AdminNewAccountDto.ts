import z from "zod";
import { AccountForm, AccountFormSchema, AccountNewFormSchema } from "../../entity/Account.js";
import { PlayerForm, PlayerInput, PlayerInputSchema } from "../../entity/Player.js";

export const NewAccountDtoSchema = z.object({
  ...AccountNewFormSchema.shape, ...PlayerInputSchema.shape
})

export type NewAccountDto = z.infer<typeof NewAccountDtoSchema>