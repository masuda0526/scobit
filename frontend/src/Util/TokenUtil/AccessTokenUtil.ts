export class AccessTokenUtil {
  static ACCESS_TOKEN_KEY = 'access_token';

  static setToken(token:string){
    return localStorage.setItem(this.ACCESS_TOKEN_KEY, token)
  }

  static getToken(){
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static removeToken(){
    return localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }
}