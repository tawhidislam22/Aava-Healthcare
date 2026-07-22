import app from "./app";


const bootstrap=()=>{
    try{
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    }catch(err){
        console.error('Error during bootstrap:', err);
    }
}

bootstrap()