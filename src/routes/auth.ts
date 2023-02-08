import express, { Express } from "express";
import { UserAuthControllers } from "../controllers/auth";
import { AuthorizationMiddleware } from "../middleware/authorization";
import { AuthValidators } from "../validators/authentication";
const router = express.Router();

// the routes
router.post("/sign-up", UserAuthControllers.signUp);
router.post("/verify-otp", AuthorizationMiddleware.verifyAuthToken,
    UserAuthControllers.verifyOtp);
router.get("/request-new-otp", AuthorizationMiddleware.verifyAuthToken, UserAuthControllers.requestNewToken)
router.post("/login", UserAuthControllers.login)
router.post("/logout", UserAuthControllers.logout)
router.post("/request-password-reset", UserAuthControllers.forgotPassword)
router.get("/me", UserAuthControllers.getUserProfile)
router.post("/set-new-password", AuthValidators.resetPassword, UserAuthControllers.setNewPassword)
router.post("/bot", UserAuthControllers.verifyOtp)
// router.post("/bot", UserAuthControllers.confirmEmail)
// router.post("/bot", UserAuthControllers.)
export default router