import { convertErrorInfos } from "@scobit/common"
import type { ZodError } from "zod"
import { FRONT_LABELS } from "../constant/labels"

export const convertToErrorInfos = (zodError:ZodError) => {
  return convertErrorInfos(zodError, FRONT_LABELS);
}