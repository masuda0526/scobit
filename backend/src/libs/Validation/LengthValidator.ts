import { ValidationDecorator } from "./ValidationDecorator.js";
import { IValidator, IValidatorProperty } from "./ValidationInterfaces.js";

export class LengthValidator extends ValidationDecorator{

  min:number;
  max:number;
  DEFAULT_ERROR_MSG: string = '{aliasName}は{min}文字以上、{max}文字以内で入力してください。';

  constructor(validator:IValidator&IValidatorProperty, min:number, max:number, msg?:string){
    super(validator);
    this.min=min;
    this.max=max;
  }

  validate(): boolean {
    if(!this.isExist()){
      return true;
    }
    if(this.validator.value.length < this.min){
      return false
    }
    if(this.validator.value.length > this.max){
      return false
    }
    return true;
  }

  replaceAliasName(msg: string): string {
    return super.replaceAliasName(msg).replace('{min}', this.min.toString()).replace('{max}', this.max.toString());
  }
}