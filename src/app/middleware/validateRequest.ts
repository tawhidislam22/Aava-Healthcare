import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validateRequest= (zodSchema:z.ZodObject)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const parseResult = zodSchema.safeParse(req.body);
        if(req.body.data){
            req.body = JSON.parse(req.body.data)
        }
        
        if (!parseResult.success) {
            next(parseResult.error);
        }


        req.body = parseResult.data;
        next()
    }
}