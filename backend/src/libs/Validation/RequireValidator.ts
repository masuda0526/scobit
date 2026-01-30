import { BaseValidator } from "./BaseValidator.js";
import { ValidationDecorator } from "./ValidationDecorator.js";
import { IValidator, IValidatorProperty } from "./ValidationInterfaces.js";

export class RequireValidator extends ValidationDecorator{


  DEFAULT_ERROR_MSG:string = '{aliasName}は必須項目です。';

  constructor(validator:IValidator&IValidatorProperty){
    super(validator);
  }

  validate(){
    if(!this.isExist()){
      return false
    }
    return true;      
  };

}