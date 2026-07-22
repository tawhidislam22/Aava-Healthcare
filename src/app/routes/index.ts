import { Router } from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.rotue";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";



const router= Router()

router.use("/specialties",SpecialtyRoutes)
router.use("/auth",AuthRoutes)
router.use("/users",UserRoutes)
router.use("/doctors",DoctorRoutes)
export const IndexRoutes=router;