import status from "http-status"
import AppError from "../../errorHelpers/AppError"
import { prisma } from "../../lib/prisma"

import { IUpdateAdminPayload } from "./admin.interface"
import { IRequestUser } from "../../interfaces/requestUser.interface"
import { UserStatus } from "../../../generated/prisma/browser"

const getAllAdmins=async()=>{
    const admins= await prisma.admin.findMany({
        include:{
            user:true
        }
    })
    return admins

}

const getAdminById=async(id:string)=>{
    const admin= await prisma.admin.findUnique({
        where:{
            id
        },
        include:{
            user:true
        }
    })
    return admin

}

const updateAdmin=async(id:string,payload:IUpdateAdminPayload)=>{
    const isAdminExists= await prisma.admin.findUnique({
        where:{
            id  
        }
    })
    if(!isAdminExists){
        throw new AppError(status.NOT_FOUND,"Admin not found")
    }

    const {admin}=payload

    const updatedAdmin= await prisma.admin.update({
        where:{
            id
        },
        data:{
            ...admin
        }
    })
    return updatedAdmin

}

const deleteAdmin=async(id:string,user:IRequestUser)=>{

    const isAdminExists= await prisma.admin.findUnique({
        where:{
            id
        }
    })
    if(!isAdminExists){
        throw new AppError(status.NOT_FOUND,"Admin not found")
    }
    if(isAdminExists.id=== user.userId){
        throw new AppError(status.BAD_REQUEST,"You can't delete yourself")
    }

    const result= await prisma.$transaction(async(tx)=>{
        await tx.admin.update({
            where:{
                id
            },
            data:{
                isDeleted:true,
                deletedAt:new Date()
            }
        })

        await tx.user.update({
            where:{
                id:isAdminExists.userId
            },
            data:{
                isDeleted:true,
                deletedAt:new Date(),
                status: UserStatus.DELETED
            }
        })

        await tx.session.deleteMany({
            where:{
                userId:isAdminExists.userId
            }
        })

        await tx.account.deleteMany({
            where:{
                userId:isAdminExists.userId
            }
        })

        const admin= getAdminById(id)
        return admin

    })

    return result

}


export const AdminService={
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
}