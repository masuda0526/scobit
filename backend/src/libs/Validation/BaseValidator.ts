import { IValidator, IValidatorProperty } from "./ValidationInterfaces.js";

export class BaseValidator implements IValidator, IValidatorProperty{
  aliasName: string;
  value:string;
  field: string;

  constructor(value:string, aliasName:string, field:string){
    this.aliasName = aliasName;
    this.value = value;
    this.field = field;
  }

  overrideErrorMessage(msg: string): void {}

  getErrorMessage(): string {
    return '';
  }

  getAliasName(){
    return this.aliasName;
  }
  
  validate(){
    return true;
  }

  execute(){}
}