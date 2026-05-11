import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { router } from "src/LambdaHandler/public/router.js";
import { adminRouter } from "src/LambdaHandler/admin/router.js";
import { logger } from "src/libs/Logger/Logger.js";
import { ResponseUtil } from "src/libs/ResponseUtil/ResponseUtil.js";

export async function routerHandler(event:APIGatewayProxyEvent):Promise<APIGatewayProxyResult>{
    const method = event.httpMethod;
    const path = event.resource;

    const publicRoute = router.find(method, path);
    const adminRoute = adminRouter.find(method, path);

    let route = null;
    if(publicRoute){
      route = publicRoute
    }
    if(adminRoute){
      route = adminRoute
    }

    // パスの検証
    if(!route){
      const res = ResponseUtil.error().addError('client', '不正なリクエストです。');
      return ResponseUtil.parseToAPIGatewayResponse(res);
    }

    // bodyの検証
    let body:unknown = {};
    try {
      body = event.body?JSON.parse(event.body):{};
    } catch (error) {
      const res = ResponseUtil.error().addError('client', '不正なリクエストです。');
      return ResponseUtil.parseToAPIGatewayResponse(res);
    }

    // Lambda関数の実行
    try {
      const res = await route.execFunc(event);
      return ResponseUtil.parseToAPIGatewayResponse(res)
    } catch (error) {
      console.error(error)
      const res = ResponseUtil.error().addError('server', 'サーバーでエラーが発生しました。');
      return ResponseUtil.parseToAPIGatewayResponse(res);
    }

  }
