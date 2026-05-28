import jwt from "jsonwebtoken";
import { env } from "../EnvPropertyUtil/Env.js";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ErrorInfo } from "@scobit/types";
import { logger } from "../Logger/Logger.js";

export type ScobitJwtObject = {
  sub:string, // account_id
  team_id?:string, // team_id
  role?:string, // 権限
}
export type JwtCheckResult = {
  isOk:boolean,
  error:ErrorInfo,
  payload?:ScobitJwtObject
}

export class JwtUtil {

  static ACCESS_TOKEN_KEY = 'access_token';
  static TOKEN_LIMIT = 60 * 60 * 24;

  static createAccessTokenBeforeSelectTeam(account_id:string){
    logger.info(`JWT作成処理`);
    const payload:ScobitJwtObject = {
      sub:account_id,
    }
    const token = jwt.sign(payload, env.JWT_SECRET_KEY, {expiresIn:this.TOKEN_LIMIT});
    logger.debugObj(payload);
    logger.debug(`JWT：${token}`);
    return token
  }

  static createAccessTokenSelectTeam(account_id:string, team_id:string, role:string){
    logger.info('JWT作成処理（チーム選択後）');
    const payload:ScobitJwtObject = {
      sub:account_id, team_id, role
    }
    const token = jwt.sign(payload, env.JWT_SECRET_KEY, {expiresIn:this.TOKEN_LIMIT});
    logger.debugObj(payload);
    logger.debug(`JWT:${token}`);
    return token;
  }

  static pickJwt(authString:string|undefined){
    logger.info(`jwt取得処理 authString:${authString}`);
    if(!authString){
      return undefined;
    }

    if(!authString.startsWith('Bearer ')){
      return undefined;
    }
    return authString.slice(7);
  }

  static pickJwtFromEvent(event:APIGatewayProxyEvent){
    const authString = event.headers.authorization;
    return this.pickJwt(authString);
  }

  static checkJwtAndGetPayload(event:APIGatewayProxyEvent):ScobitJwtObject{
    const token = this.pickJwtFromEvent(event);
    if(!token){
      logger.info('トークン情報がありません。');
      throw new Error('トークン情報がありません。');
    }

    const result = this.checkToken(token);
    if(!result.isOk){
      logger.info('トークンチェックエラー。')
      throw new Error('トークンチェックエラー。');
    }

    if(!result.payload){
      logger.info('トークンにペイロードが含まれていません。');
      throw new Error()
    }
    logger.info('JWTチェックOK');
    logger.debugObj(result.payload)

    return result.payload;
  }

  static checkToken(token:string):JwtCheckResult{
    try {
      logger.debug(`jwtチェック処理　token=${token}`);
      const decoded = jwt.verify(token, env.JWT_SECRET_KEY);
      if(typeof decoded === 'string'){
        logger.debug(`トークン形式不正 decoded=${decoded}`);
        return {
          isOk:false,
          error:{field:this.ACCESS_TOKEN_KEY, message:'トークンの形式が不正です。'}
        } 
      }

      logger.debug('トークンチェックOK');
      return {
        isOk:true,
        error:{field:'dummy', message:'dummy'},
        payload:decoded as ScobitJwtObject
      }

    } catch (error) {
      console.error(error);

      if(error instanceof jwt.TokenExpiredError){
        logger.debug(`トークン期限切れ`);
        return {
          isOk:false,
          error:{field:this.ACCESS_TOKEN_KEY, message:'トークンの期限切れです。'},
        }
      }

      logger.debug('トークンエラー');
      return {
        isOk:false,
        error:{field:this.ACCESS_TOKEN_KEY, message:'トークン検証に失敗しました。'},
      }
    }
  }

}