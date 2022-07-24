import { getCustomers,getCustomersById } from "../controllers/customersController.js";
import { Router } from "express";

const router = Router();

router.get("/costumers", getCustomers);
router.get("/customers/:id",getCustomersById);


export default router;
