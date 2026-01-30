import { ValidationDecorator } from "./ValidationDecorator.js";
import { IValidator, IValidatorProperty } from "./ValidationInterfaces.js";

export class EmailValidator extends ValidationDecorator{

  DEFAULT_ERROR_MSG: string = 'メールアドレス形式で入力してください。';

  constructor(validator:IValidator&IValidatorProperty){
    super(validator)
  }

  validate(): boolean {
    if(!this.isExist()){
      return true;
    }
    const regexp = /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    return regexp.test(this.value);
  }
}