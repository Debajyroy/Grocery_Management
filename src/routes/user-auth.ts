import express from "express";
import SchemaValidator from "../middleware/schema-validator"
import { createUserSchema, UserloginSchema } from "../validation/user-validation";
import { createUser, loginUser, logoutUser } from "../controllers/user-auth";

const router = express.Router();

router.post("/create",SchemaValidator(createUserSchema), createUser);
router.post("/login",SchemaValidator(UserloginSchema), loginUser);
router.post("/logout",logoutUser);


export default router;