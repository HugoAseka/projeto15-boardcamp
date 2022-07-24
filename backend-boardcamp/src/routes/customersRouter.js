import { getCustomers } from "../controllers/customersController.js";
import { Router } from "express";

const router = Router();

router.get("/costumers", getCustomers);

export default router;
