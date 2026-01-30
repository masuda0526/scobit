export interface ResponseFormat {
  isSuccess:boolean,
  isRedirect:boolean,
  redirectUrl:string,
  erros:ErrorInfo[],
  Project:object,
  settings:object,
  others:object
}

export interface ErrorInfo{
  name:string,
  msg:string
}