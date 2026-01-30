import { ErrorInfo, ResponseFormat } from "../ResponseUtil/ResponseFormat.js";
import { ValidationBuilder } from "./ValidationBuilder.js"

export class ValidationContext{
  
  private validators:ValidationBuilder[] = [];

  private errors:ErrorInfo[] = []

  add(validationBuilder:ValidationBuilder){
    this.validators.push(validationBuilder);
  }

  get errorInfos():ErrorInfo[]{
    return this.errors;
  }

  validate():boolean{
    this.validators.forEach(v => {
      v.execute(this.errors)
    })
    return this.errors.length === 0;
  }

}