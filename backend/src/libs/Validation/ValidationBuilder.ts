import { ErrorInfo } from "../ResponseUtil/ResponseFormat.js";
import { BaseValidator } from "./BaseValidator.js";
import { EmailValidator } from "./EmailValidator.js";
import { LengthValidator } from "./LengthValidator.js";
import { RequireValidator } from "./RequireValidator.js";
import { IValidator, IValidatorProperty } from "./ValidationInterfaces.js";

export class ValidationBuilder{

  private validator:IValidator&IValidatorProperty;

  constructor(value:string, aliasName:string, field:string){
    this.validator = new BaseValidator(value, aliasName, field);
  }

  require(msg?:string){
    this.validator = new RequireValidator(this.validator);
    if(msg){
      this.validator.overrideErrorMessage(msg)
    }
    return this;
  }

  length(min:number, max:number, msg?:string){
    this.validator = new LengthValidator(this.validator, min, max);
    if(msg){
      this.validator.overrideErrorMessage(msg);
    }
    return this;
  }

  email(msg?:string){
    this.validator = new EmailValidator(this.validator);
    if(msg)this.validator.overrideErrorMessage(msg)
    return this;
  }

  execute(errors:ErrorInfo[]){
    if(!this.validator.validate()){
      errors.push({
        field:this.validator.field,
        message:this.validator.getErrorMessage()
      })
    }
    this.validator.execute();
  }
}