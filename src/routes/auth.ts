import express, { Express } from "express";
import { UserAuthControllers } from "../controllers/auth";
const router = express.Router();

// the routes
router.post("/sign-up", UserAuthControllers.signUp);
router.get("/login", UserAuthControllers.login)
router.post("/logout", UserAuthControllers.logout)
router.post("/req-password-reset", UserAuthControllers.forgotPassword)
router.get("/me", UserAuthControllers.getUserProfile)
router.post("/set-new-password", UserAuthControllers.setNewPassword)
router.post("/bot", UserAuthControllers.verifyOtp)
router.post("/bot", UserAuthControllers.confirmEmail)
// router.post("/bot", UserAuthControllers.)
export default router