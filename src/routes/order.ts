import express from "express";
import SchemaValidator from "../middleware/schema-validator";
import { isUserAuthenticated, isAdminAuthenticated } from "../middleware/auth";
import { orderSchema } from "../validation/order-validation";
import { createOrder, getStockDetails, getOrderSnapshot } from "../controllers/order";

const router = express.Router();

router.post("/order",isUserAuthenticated, SchemaValidator(orderSchema),createOrder);
router.get("/stockDetails",isAdminAuthenticated,getStockDetails);

router.get("/orders",isAdminAuthenticated, getOrderSnapshot);

export default router; 