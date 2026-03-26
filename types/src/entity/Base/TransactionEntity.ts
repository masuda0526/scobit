import z from "zod";
import { AbstractEntitySchema } from "./AbstractEntity.js";

export const TransactionEntitySchema = AbstractEntitySchema.extend({
  ver:z.number()
})
