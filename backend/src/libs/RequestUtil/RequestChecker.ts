import { APIGatewayProxyEvent } from "aws-lambda";

export interface IRequestChecker{
  setNext:(requestChecker: IRequestChecker)=>IRequestChecker;
  check:(event:APIGatewayProxyEvent)=>boolean;
}

export abstract class BaseRequestChecker implements  IRequestChecker{
  private next?: IRequestChecker;

  setNext(requestChecker:IRequestChecker):IRequestChecker{
    this.next = requestChecker;
    return this.next
  }

  protected nextChecker(event:APIGatewayProxyEvent){
    return this.next?this.next.check(event):true;
  }
  abstract check(event: APIGatewayProxyEvent):boolean;
}

export class ExistBodyRequestChecker extends BaseRequestChecker{
  check(event: APIGatewayProxyEvent){
    if(!event.body){
      return false;
    }
    return this.nextChecker(event);
  };
}

export class ExistParamRequestChecker extends BaseRequestChecker{
  params:string[];
  constructor(...params:string[]){
    super();
    this.params = params
  }

  check(event: APIGatewayProxyEvent): boolean {
    const body = JSON.stringify(event.body);
    let result = true;
    this.params.forEach(param => {
      if(!body.includes(param)){
        result = false;
      }
    })
    if(!result){
      return false;
    }
    return this.nextChecker(event);
  }
}