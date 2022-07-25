import {
  deleteRental,
  getRentals,
  insertRental,
  returnRental,
} from "../controllers/rentalsController.js";
import { Router } from "express";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", insertRental);
router.post("/rentals/:id/return", returnRental);
router.delete("/rentals/:id", deleteRental);

export default router;
