import { JwtUtil, ScobitJwtObject } from "src/libs/JwtUtil/JwtUtil.js";
import jwt from 'jsonwebtoken'
import { env } from "src/libs/EnvPropertyUtil/Env.js";

export class JwtCreator{
  static JWT_LIMIT = 1;

  static create(objs?:[{key:keyof ScobitJwtObject, val:string}]){
    let payload : ScobitJwtObject = {
      sub:'370a8d68-c6bb-4a2a-ab9c-e85b0049474b'
      // sub:'18b9c78a-e0b0-4c6b-9d2c-759496702a85'
    }
    if(objs){
      objs.forEach(obj => {
        payload = {...payload, [obj.key]:obj.val}
      })
    }
    const token = jwt.sign(payload, env.JWT_SECRET_KEY, {expiresIn:this.JWT_LIMIT})
    return token;
  }



}