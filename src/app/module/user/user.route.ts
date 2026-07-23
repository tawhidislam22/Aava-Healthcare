import {  Router } from "express";
import { UserController } from "./user.controller";
import { createDoctorValidationSchema, createAdminValidationSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../../../generated/prisma/browser";
import { checkAuth } from "../../middleware/checkAuth";
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
validateRequest(createDoctorValidationSchema)
,
UserController.createDoctor)

router.post("/create-admin",
    validateRequest(createAdminValidationSchema),
    checkAuth(Role.SUPER_ADMIN,Role.ADMIN),
    UserController.createAdmin)

export const UserRoutes=router