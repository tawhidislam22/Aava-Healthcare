import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/browser";

const router = Router();

router.post('/register',AuthController.registerPatient)
router.post('/login',AuthController.loginUser)

router.post('/me',
    checkAuth(Role.PATIENT,Role.ADMIN,Role.DOCTOR,Role.SUPER_ADMIN),
AuthController.getMe)

router.post('/refresh-token',AuthController.getNewToken)
router.post('/change-password',
    checkAuth(Role.PATIENT,Role.ADMIN,Role.DOCTOR,Role.SUPER_ADMIN),
    AuthController.changePassword)
router.post('/logout',
    checkAuth(Role.PATIENT,Role.ADMIN,Role.DOCTOR,Role.SUPER_ADMIN),
    AuthController.logoutUser
)

router.post('/verify-email',AuthController.verifyEmail)
router.post('/forget-password',AuthController.forgetPassword)
router.post('/reset-password',AuthController.resetPassword)

router.get('/login/google',AuthController.googleLogin)
router.get('/google/success',AuthController.googleLoginSuccess)
router.get('/google/error',AuthController.handleOAuthError)
export const AuthRoutes = router;