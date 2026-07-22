import { Router } from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.rotue";
import { AuthRoutes } from "../module/auth/auth.route";



const router= Router()

router.use("/specialties",SpecialtyRoutes)
router.use("/auth",AuthRoutes)
export const IndexRoutes=router;