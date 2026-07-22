import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

const registerPatient = catchAsync(
    async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AuthService.registerPatient(payload);

    const {accessToken, refreshToken,token, ...rest} = result

    tokenUtils.setAccessTokenCookie(res, accessToken as string);
    tokenUtils.setRefreshTokenCookie(res, refreshToken as string);
    tokenUtils.setBetterAuthTokenCookie(res, token as string);
    
    sendResponse(res,{
        httpStatusCode:status.CREATED,
        success:true,
        message:"Patient created successfully",
        data:{
            accessToken,
            refreshToken,
            token,
            ...rest
        }
    })
});

const loginUser=catchAsync(
    async(req:Request,res:Response)=>{
        const payload=req.body
        const result= await AuthService.loginUser(payload)
        const {accessToken, refreshToken,token, ...rest} = result

        tokenUtils.setAccessTokenCookie(res, accessToken as string);
        tokenUtils.setRefreshTokenCookie(res, refreshToken as string);
        tokenUtils.setBetterAuthTokenCookie(res, token as string);

        sendResponse(res,{
            httpStatusCode:status.OK,
            success:true,
            message:"Login user successfully",
            data:{
                accessToken,
                refreshToken,
                token,
                ...rest
            }
        })
    })

export const AuthController={
    registerPatient,
    loginUser
}