import { Router } from "./router.js";

export function routerHandler(router:Router){
  return async (event: any) => {

    const method = event.requestContext.http.method;
    const path = event.rawPath;

    const route = router.find(method, path);

    if(!route){
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Not Found" })
      }
    }

    const body = JSON.parse(event.body || "{}");
    const result = await route.handler(body);
    
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  }
}