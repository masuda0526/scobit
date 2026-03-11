import { ResponseBuilder } from "./ResponseBuilder.js";

export class Res {

  static success<T extends Record<string, any> = Record<string, any>>() {
    return new ResponseBuilder<T>(true);
  }

  static error<T extends Record<string, any> = Record<string, any>>() {
    return new ResponseBuilder<T>(false);
  }

}