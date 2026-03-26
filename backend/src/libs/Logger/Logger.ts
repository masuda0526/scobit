import { env } from "../EnvPropertyUtil/Env.js";

class Logger {

    private level:string = env.LOG_LEVEL;

    debug(msg:string){
        if(this.level === "DEBUG"){
            console.log(`[DEBUG] ${this.prefix()} ${msg}`);
        }
    }

    info(msg:string){
        if(["DEBUG","INFO"].includes(this.level)){
            console.log(`[INFO] ${this.prefix()} ${msg}`);
        }
    }

    error(msg:string){
        console.error(`[ERROR] ${this.prefix()} ${msg}`);
    }

    debugObj(data:any){
        if(this.level === "DEBUG"){
            console.log(`[DEBUG_OBJECT] ${this.prefix()} `);
            console.debug(data)
        }
    }

    private prefix():string{
        return new Date().toLocaleString();
    }
}

export const logger = new Logger();
