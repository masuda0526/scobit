import { convertErrorInfos } from "@scobit/common";
import type { ZodError } from "zod";
import { BACKEND_LABELS } from "./labels.js";

export const convertToErrorInfos = (zodError:ZodError) => {
  return convertErrorInfos(zodError, BACKEND_LABELS);
}