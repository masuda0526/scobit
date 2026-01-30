export interface ResponseFormat<T = any> {
  isSuccess:boolean;
  isRedirect:boolean;
  redirectUrl?:string;
  errors:ErrorInfo[];
  flashMsgs?:string[];
  data?:T;
  headers?:any;
}

export interface ErrorInfo{
  field:string,
  message:string
}