import express from "express";
import SchemaValidator from "../middleware/schema-validator";
import { taskSchema } from "../validation/task-validation";
import { isAdminAuthenticated } from "../middleware/auth";
import { createTask } from "../controllers/task";

const router = express.Router();

router.post("/tasks", isAdminAuthenticated, SchemaValidator(taskSchema), createTask);



export default router;