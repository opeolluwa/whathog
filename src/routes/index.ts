import express, { Express } from "express";
import Controllers from "../controllers";
const router = express.Router();

router.post("/seed", Controllers.saveResponse);
export default router;