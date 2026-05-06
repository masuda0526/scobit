import { ErrorInfo } from "@scobit/types";
import {z, ZodError} from "zod";


export type LabelDef = {
  key:string,
  label:string,
  type:"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
}

const findMessage = (issue: z.core.$ZodIssue, labels:LabelDef[]): string => {
  const field = issue.path[0]?.toString() ?? '';
  const labelDef = labels.find(l => l.key === field);
  const label = labelDef?.label ?? field;
  const type = labelDef?.type;

  if (issue.code === 'too_small') {
    if (type === 'string') {
      return `${label}は必須項目です。`;
    }
    if (type === 'number') {
      return `${label}は${issue.minimum}以上で入力してください。`;
    }
  }

  if (issue.code === 'too_big') {
    if (type === 'string') {
      return `${label}は${issue.maximum}文字以内で入力してください。`;
    }
    if (type === 'number') {
      return `${label}は${issue.maximum}以内で入力してください。`;
    }
  }

  if (issue.code === 'custom') {
    return issue.message;
  }

  return `${label}の入力内容を確認してください。`;
};


const convertErrorInfo = (issue: z.core.$ZodIssue, labels:LabelDef[]): ErrorInfo => {
  return {
    field: issue.path[0]?.toString() ?? '',
    message: findMessage(issue, labels),
  };
};

export const convertErrorInfos = (zodError: ZodError, labels:LabelDef[]): ErrorInfo[] => {
  return zodError.issues.map(iss => convertErrorInfo(iss, labels));
};