import { ErrorInfo, ResponseFormat } from "@scobit/types";

export class ResponseBodyBuilder<T extends Record<string, any> = Record<string, any>>{

  private isSuccess:boolean;
  private isRedirect:boolean = false;
  private redirectUrl:string = '';
  private flashMsgs:string[] = [];
  private errors:ErrorInfo[] = [];
  private data:T = {} as T;

  constructor(isSuccess:boolean = true){
    this.isSuccess = isSuccess;
  }

  toResponse():ResponseFormat<T>{    
    return {
      isSuccess:this.isSuccess,
      isRedirect:this.isRedirect,
      redirectUrl:this.redirectUrl,
      flashMsgs:this.flashMsgs,
      errors:this.errors,
      data:this.data
    }
  }

  setRedirect(isRedirect:boolean){
    this.isRedirect = isRedirect;
    return this;
  }

  redirectTo(url:string){
    this.redirectUrl = url
    return this;
  }

  addFlash(message:string){
    this.flashMsgs.push(message);
    return this;
  }

  addError(field:string, message:string){
    this.errors.push({field, message});
    return this;
  }

  addErrors(errors:ErrorInfo[]){
    this.errors = [...this.errors, ...errors];
    return this;
  }

  putData<K extends keyof T>(key:K, value:T[K]){
    this.data[key] = value;
    return this;
  }

  setData(data:T){
    this.data = {...this.data, ...data}
    return this;
  }

  isError(){
    return !this.isSuccess;
  }

}