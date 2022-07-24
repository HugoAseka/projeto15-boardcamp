import {
  getCustomers,
  getCustomersById,
  insertCustomers,
  updateCostumer,
} from "../controllers/customersController.js";
import { Router } from "express";

const router = Router();

router.get("/costumers", getCustomers);
router.get("/customers/:id", getCustomersById);
router.post("/customers", insertCustomers);
router.put("/customers/:id", updateCostumer);

export default router;
