import {
  getCustomers,
  getCustomersById,
  inserCustomers,
} from "../controllers/customersController.js";
import { Router } from "express";

const router = Router();

router.get("/costumers", getCustomers);
router.get("/customers/:id", getCustomersById);
router.post("/customers", inserCustomers);

export default router;
