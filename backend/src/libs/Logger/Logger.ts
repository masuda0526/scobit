class Logger {

    private level:string = process.env.LOG_LEVEL ?? "DEBUG";

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

    private prefix():string{
        return new Date().toISOString();
    }
}

export const logger = new Logger();
