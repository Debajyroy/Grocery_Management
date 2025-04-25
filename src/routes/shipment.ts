import express from "express";
import { isAdminAuthenticated } from "../middleware/auth";
import { shipmentStatistics, shipmentDetails } from "../controllers/shipment";



const router = express.Router();

router.get("/shipment", isAdminAuthenticated, shipmentStatistics);
router.get("/shipmentDetails", isAdminAuthenticated, shipmentDetails);

export default router;