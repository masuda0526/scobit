export type ResponseFormat<T = any>  = {
  isSuccess:boolean;
  isRedirect:boolean;
  redirectUrl?:string;
  flashMsgs?:string[];
  errors?:ErrorInfo[];
  data?:T;
  headers?:any;
}

export type ErrorInfo = {
  field:string;
  message:string;
}

export type ScoreValidationResult = {
  player_id:string,
  errors:ErrorInfo[]
}