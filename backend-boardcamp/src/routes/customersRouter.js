import {
  getCustomers,
  getCustomersById,
  insertCustomers,
  updateCustomer,
} from "../controllers/customersController.js";
import { Router } from "express";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomersById);
router.post("/customers", insertCustomers);
router.put("/customers/:id", updateCustomer);

export default router;
