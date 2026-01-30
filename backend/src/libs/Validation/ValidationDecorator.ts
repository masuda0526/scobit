import { IValidator, IValidatorProperty } from "./ValidationInterfaces.js";

export abstract class ValidationDecorator implements IValidator, IValidatorProperty{
  
  validator:IValidator&IValidatorProperty;

  DEFAULT_ERROR_MSG:string = '';
  OVERRIDE_ERROR_MSG:string = '';
  
  constructor(validator:IValidator&IValidatorProperty){
    this.validator = validator;
  }

  get field(){
    return this.validator.field;
  }
  get value(){
    return this.validator.value;
  }

  get aliasName(){
    return this.validator.aliasName;
  }

  overrideErrorMessage(msg:string){
    this.OVERRIDE_ERROR_MSG = msg;
  }
  
  getErrorMessage(){
    if(this.OVERRIDE_ERROR_MSG === ''){
      return this.replaceAliasName(this.DEFAULT_ERROR_MSG);
    }
    return this.replaceAliasName(this.OVERRIDE_ERROR_MSG);
  }

  replaceAliasName(msg:string):string{
    return msg.replace('{aliasName}', this.validator.aliasName);
  }

  isExist(){
    const value = this.validator.value;
    if(value === null || value===''){
      return false;
    }
    if(typeof value === 'undefined'){
      return false;
    }
    return true;
  }

  abstract validate():boolean;

  execute(){
    this.validator.execute();
  }
}