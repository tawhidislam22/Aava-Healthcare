import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";



const getAllDoctors=catchAsync(
    async(req:Request,res:Response)=>{
        const doctors = await DoctorService.getAllDoctors()

        sendResponse(res,{
            httpStatusCode:status.OK,
            success:true,
            message:"All doctor find successfully",
            data:doctors
        })
})

export const DoctorController={
    getAllDoctors
}