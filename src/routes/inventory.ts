import express from "express";
import { isAdminAuthenticated } from "../middleware/auth";
import SchemaValidator from "../middleware/schema-validator";
import { productSchema } from "../validation/invantory-product-validation";
import { createProduct, getNewStock, dailyOrderList, summary } from "../controllers/invantory";


const router = express.Router();

router.post("/inventory", isAdminAuthenticated, SchemaValidator(productSchema), createProduct);
router.get("/inventory/newStock", isAdminAuthenticated, getNewStock);
router.get("/inventory/orders",isAdminAuthenticated,dailyOrderList);
router.get("/inventory/summary",isAdminAuthenticated,summary )

export default router;