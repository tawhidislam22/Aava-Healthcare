import { Router } from "express"
import { AdminController } from "./admin.controller"
import { Role } from "../../../generated/prisma/browser"
import { checkAuth } from "../../middleware/checkAuth"
import { updateAdminZodSchema } from "./admin.validation"
import { validateRequest } from "../../middleware/validateRequest"

const router=Router()

router.get("/",
    checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
    AdminController.getAllAdmins)
router.get("/:id",
    checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
    AdminController.getAdminById)
router.put("/:id",
    checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
    validateRequest(updateAdminZodSchema),
    AdminController.updateAdmin)
router.delete("/:id",
    checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
    AdminController.deleteAdmin)

export const AdminRoutes=router
