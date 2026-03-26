import { APIGatewayProxyEvent } from "aws-lambda";
import { ResponseBodyBuilder } from "src/libs/ResponseUtil/ResponseBuilder.js";

type Route = {
  method:'GET'|'POST';
  path:string;
  execFunc:(event: APIGatewayProxyEvent) => Promise<ResponseBodyBuilder>;
}

export class Router {
  private routes: Route[] = [];

  get(path:string, execFunc:(body:any) => Promise<ResponseBodyBuilder>){
    this.routes.push({method:'GET', path ,execFunc});
  }

  post(path:string, execFunc:(body:any) => Promise<ResponseBodyBuilder>){
    this.routes.push({method:'POST', path, execFunc});
  }

  find(method: string, path: string){
    return this.routes.find(r => r.method === method && r.path === path);
  }
}