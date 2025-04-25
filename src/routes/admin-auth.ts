import express from "express";
import SchemaValidator from "../middleware/schema-validator"
import { createAdmin, loginAdmin, logoutAdmin } from "../controllers/admin-auth";
import { createAdminSchema, loginSchema } from "../validation/admin-validation";


const router = express.Router();

router.post("/create",SchemaValidator(createAdminSchema),createAdmin);
router.post("/signin",SchemaValidator(loginSchema), loginAdmin);
router.post("/signout", logoutAdmin);



export default router;