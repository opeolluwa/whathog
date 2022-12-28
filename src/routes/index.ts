import express, { Express } from "express";
import Controllers from "../controllers";
const router = express.Router();

// the routes gies hete
router.post("/seed", Controllers.saveResponse);
router.get("/seed", Controllers.getResponses)
router.post("/bot", Controllers.chat)
export default router;