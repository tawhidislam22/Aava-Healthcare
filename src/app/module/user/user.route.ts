import {  Router } from "express";
import { UserController } from "./user.controller";
import { createDoctorZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
const router=Router()




router.post("/create-doctor",
//     (req:Request,res:Response,next:NextFunction)=>{
//     const parseResult = createDoctorZodSchema.safeParse(req.body);
//     if (!parseResult.success) {
//         next(parseResult.error);
//     }
//     req.body = parseResult.data;
//     next()
// }
validateRequest(createDoctorZodSchema)
,
UserController.createDoctor)

export const UserRoutes=router