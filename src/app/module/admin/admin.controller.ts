import status from "http-status"
import { catchAsync } from "../../shared/catchAsync"
import { sendResponse } from "../../shared/sendResponse"
import { AdminService } from "./admin.service"
import { Request, Response } from "express"

const getAllAdmins=catchAsync(
    async(req:Request,res:Response)=>{
    const admins= await AdminService.getAllAdmins()
    sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"All admins find successfully",
        data:admins
    })
})

const getAdminById=catchAsync(
    async(req:Request,res:Response)=>{
        const {id}= req.params
        const admin= await AdminService.getAdminById(id as string)
        sendResponse(res,{
            httpStatusCode:status.OK,
            success:true,
            message:"Admin found successfully",

            data:admin
        })
    }
)


const updateAdmin=catchAsync(
    async(req:Request,res:Response)=>{
        const {id}= req.params
        const payload = req.body
        const admin= await AdminService.updateAdmin(id as string,payload)
        sendResponse(res,{
            httpStatusCode:status.OK,
            success:true,
            message:"Admin updated successfully",
            data:admin
        })
    }
)


const deleteAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = req.user;

        const result = await AdminService.deleteAdmin(id as string, user);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Admin deleted successfully",
            data: result,
        })
    }

)



export const AdminController={    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
}