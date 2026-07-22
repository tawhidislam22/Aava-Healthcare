import app from "./app";
import { envVars } from "./app/config/env";


const bootstrap=()=>{
    try{
        app.listen(envVars.PORT,()=>{
            console.log(`Server is running on port ${envVars.PORT}`);
        })
    }catch(err){
        console.error('Error during bootstrap:', err);
    }
}

bootstrap()