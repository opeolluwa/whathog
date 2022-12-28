import express, { Express } from "express";
import Controllers from "../controllers";
const router = express.Router();

router.post("/seed", Controllers.saveResponse);
router.get("/seed", Controllers.getResponses)
router.get("/bot", Controllers.chat)
export default router;