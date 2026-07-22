import { NextFunction, Request, Response, Router } from "express";
import { DoctorController } from "./doctor.controller";
import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

const router=Router()



router.get('/',(req:Request,res:Response,next:NextFunction)=>{

},DoctorController.getAllDoctors)

export const DoctorRoutes=router