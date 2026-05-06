import { ErrorInfo } from "@scobit/types";
import { ZodError } from "zod";
export type LabelDef = {
    key: string;
    label: string;
    type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
};
export declare const convertErrorInfos: (zodError: ZodError, labels: LabelDef[]) => ErrorInfo[];
//# sourceMappingURL=ZodUtil.d.ts.map