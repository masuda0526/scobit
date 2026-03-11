import { METHODS } from "http";
import z from "zod";

type Route = {
  method:'GET'|'POST';
  path:string;
  handler:Function;
}

export class Router {
  private routes: Route[] = [];

  get(path:string, handler:Function){
    this.routes.push({method:'GET', path ,handler});
  }

  post(path:string, handler:Function){
    this.routes.push({method:'POST', path, handler});
  }

  find(method: string, path: string){
    return this.routes.find(r => r.method === method && r.path === path);
  }
}