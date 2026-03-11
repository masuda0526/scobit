import z from "zod";
import { AbstractEntitySchema } from "./AbstractEntity";

export const TransactionEntitySchema = AbstractEntitySchema.extend({
  ver:z.number()
})
