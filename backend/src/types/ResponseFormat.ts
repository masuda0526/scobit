export interface ResponseFormat {
  isSuccess:boolean,
  isRedirect:boolean,
  redirectUrl:string,
  errors:ErrorInfo[],
  others:object
}

export interface ErrorInfo{
  name:string,
  msg:string
}