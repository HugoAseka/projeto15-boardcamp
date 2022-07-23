import { getCategories, insertCategory } from "../controllers/categoriesController.js";
import { Router } from "express";

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', insertCategory);


export default router;