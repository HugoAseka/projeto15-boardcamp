import { getRentals, insertRental } from "../controllers/rentalsController.js";
import { Router } from "express";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", insertRental);

export default router;
