import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";


export const checkAuth=(...authRoles:Role[])=>
    async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const sessionToken= cookieUtils.getCookie(req,"better-auth-session-token")
            if(!sessionToken){
                throw new AppError(status.UNAUTHORIZED,"Unauthorized access! No session token found.")
            }
            if(sessionToken){
                const sessionExists= await prisma.session.findFirst({
                    where:{
                        token:sessionToken,
                        expiresAt:{
                            gt:new Date()
                        }
                    },
                    include:{
                        user:true
                    }
                })

                if(sessionExists && sessionExists.user){
                    const user= sessionExists.user
                    const now= new Date()
                    const expiresAt= new Date(sessionExists.expiresAt)
                    const createdAt= new Date(sessionExists.createdAt)
                    const sessionLifetime= expiresAt.getTime() - createdAt.getTime()
                    const timeRemaining= expiresAt.getTime() - now.getTime()
                    const percentageRemaining= (timeRemaining/sessionLifetime)*100

                    if(percentageRemaining<20){
                        res.setHeader("X-Session-Refresh","true")
                        res.setHeader("X-Session-Expires-At",expiresAt.toISOString())
                        res.setHeader("X-Time-Remaining",timeRemaining.toString())


                        console.log("Session is about to expire. Refreshing session...")

                    }

                    if(user.status===UserStatus.BLOCKED || user.status===UserStatus.DELETED){
                        throw new AppError(status.UNAUTHORIZED,"Unauthorized access! User is blocked.")
                    }
                    if(user.isDeleted){
                        throw new AppError(status.UNAUTHORIZED,"Unauthorized access! User is deleted.")
                    }
                    if(authRoles.length>0 && !authRoles.includes(user.role)){
                        throw new AppError(status.FORBIDDEN,"Unauthorized access! User does not have the required role.")
                    }
                    const accessToken= cookieUtils.getCookie(req,"accessToken")
                    if(!accessToken){
                        throw new AppError(status.UNAUTHORIZED,"Unauthorized access! No access token found.")
                    }

                }
                const accessToken= cookieUtils.getCookie(req,"accessToken")
                if(!accessToken){
                    throw new AppError(status.UNAUTHORIZED,"Unauthorized access! No access token found.")
                }

                const verifyToken = jwtUtils.verifyToken(accessToken,envVars.ACCESS_TOKEN_SECRET)

                if(!verifyToken.success){
                    throw new AppError(status.UNAUTHORIZED,"Unauthorized access! Invalid access token.")
                }

                if(authRoles.length>0 && !authRoles.includes(verifyToken.data!.role as Role)){
                    throw new AppError(status.FORBIDDEN,"Unauthorized access! User does not have the required role.")
                }
            }
            next()

        }catch(error:any){
            next(error)
        }

}