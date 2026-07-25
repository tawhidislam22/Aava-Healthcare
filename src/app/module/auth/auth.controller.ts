import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";
import { cookieUtils } from "../../utils/cookie";
import { envVars } from "../../config/env";
import { auth } from "../../lib/auth";

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

    const getMe=catchAsync(
        async(req:Request,res:Response)=>{
            const user= req.user
            const result= await AuthService.getMe(user)
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"Get user successfully",
                data:result
            })
        }
    )

    const getNewToken=catchAsync(
        async(req:Request,res:Response)=>{
            const refreshToken=req.cookies.refreshToken

            const betterAuthSessionToken=req.cookies["better-auth.session_token"]

            if(!refreshToken){
                throw new AppError(status.UNAUTHORIZED,"Unauthorized access! No refresh token found.")
            }
            const result= await AuthService.getNewToken(refreshToken,betterAuthSessionToken)
            const {accessToken, refreshToken:newRefreshToken,sessionToken} = result

            tokenUtils.setAccessTokenCookie(res, accessToken as string);
            tokenUtils.setRefreshTokenCookie(res, newRefreshToken as string);
            tokenUtils.setBetterAuthTokenCookie(res, sessionToken as string);
            sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "New tokens generated successfully",
            data: {
                accessToken,
                refreshToken: newRefreshToken,
                sessionToken,
            },
        });
    }
    )

    const changePassword=catchAsync(
        async(req:Request,res:Response)=>{
            const payload=req.body
            const betterAuthSessionToken=req.cookies["better-auth.session_token"]
            const result= await AuthService.changePassword(payload,betterAuthSessionToken)
            const {accessToken, refreshToken:newRefreshToken,token} = result

            tokenUtils.setAccessTokenCookie(res, accessToken as string);
            tokenUtils.setRefreshTokenCookie(res, newRefreshToken as string);
            tokenUtils.setBetterAuthTokenCookie(res, token as string);
            sendResponse(res, {
                httpStatusCode: status.OK,
                success: true,
                message: "Password changed successfully",
                data: {
                    accessToken,
                    refreshToken: newRefreshToken,
                    sessionToken: token,
                },
            });
        }
    )

    const logoutUser=catchAsync(
        async(req:Request,res:Response)=>{
            const betterAuthSessionToken=req.cookies["better-auth.session_token"]
            const result= await AuthService.logoutUser(betterAuthSessionToken)
            cookieUtils.clearCookie(res, 'accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        cookieUtils.clearCookie(res, 'refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        cookieUtils.clearCookie(res, 'better-auth.session_token', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
            sendResponse(res, {
                httpStatusCode: status.OK,
                success: true,
                message: "User logged out successfully",
                data: result,
            });
        }
    )


    const verifyEmail=catchAsync(
        async(req:Request,res:Response)=>{
            const {email,otp}= req.body
            await AuthService.verifyEmail(email,otp)
            sendResponse(res,{
                httpStatusCode: status.OK,
                success: true,
                message: "Email verified successfully",
                
            });
        }
    )

    const forgetPassword=catchAsync(
        async(req:Request,res:Response)=>{
            const {email}= req.body
            await AuthService.forgetPassword(email)
            sendResponse(res,{
                httpStatusCode: status.OK,
                success: true,
                message: "Password reset OTP sent successfully",
            });

        }
    )

    const resetPassword=catchAsync(
        async(req:Request,res:Response)=>{
            const {email,otp,newPassword}= req.body
            const result= await AuthService.resetPassword(email,otp,newPassword)
            

            sendResponse(res,{
                httpStatusCode: status.OK,
                success: true,
                message: "Password reset successfully",
                data: result,
            });
        }
    )

    const googleLogin=catchAsync(
        async(req:Request,res:Response)=>{
            const redirectPath= req.query.redirectPath as string || "/dashboard"

            const encodedRedirectPath= encodeURIComponent(redirectPath)
            const callbackURL= `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/callback?redirectPath=${encodedRedirectPath}`

            res.render("googleRedirect",{
                callbackURL : callbackURL,
                betterAuthUrl : envVars.BETTER_AUTH_URL,
            })
        })

        const googleLoginSuccess=catchAsync(
            async(req:Request,res:Response)=>{
                const redirectPath= req.query.redirectPath as string || "/dashboard"
                const sessionToken=req.cookies["better-auth.session_token"]
                if(!sessionToken){
                    throw new AppError(status.UNAUTHORIZED,"Unauthorized access! No session token found.")
                }

                const session= await auth.api.getSession({
                    headers:{
                        cookie: `better-auth.session_token=${sessionToken}`
                    }
                })

                if(!session){
                    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`)
                }
                if(session && !session.user){
                    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`)
                }

                const result= await AuthService.googleLoginSuccess(session)

                const {accessToken,refreshToken}= result

                const isValidRedirectPath= redirectPath.startsWith("/") && !redirectPath.startsWith("//")

                const finalRedirectPath= isValidRedirectPath ? redirectPath : "/dashboard"

                res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`)

            }
        )

        const handleOAuthError=catchAsync(
            async(req:Request,res:Response)=>{
                const error = req.query.error as string || "oauth_failed";
                res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
            }
        )

export const AuthController={
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logoutUser,
    verifyEmail,
    forgetPassword,
    resetPassword,
    googleLogin,
    googleLoginSuccess,
    handleOAuthError
}