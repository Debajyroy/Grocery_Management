import express from "express";
import { getAdminProfile } from "../controllers/admin-profile";
import { isAdminAuthenticated } from "../middleware/auth";

const router = express.Router();

router.get("/profile",isAdminAuthenticated,getAdminProfile);

export default router;