import { ErrorInfo } from "../ResponseUtil/ResponseFormat.js";

export interface IValidator {
  getErrorMessage():string;
  overrideErrorMessage(msg:string):void;
  validate():boolean;
  execute():void;
}

export interface IValidatorProperty{
  aliasName:string;
  field:string;
  value:string;
}
