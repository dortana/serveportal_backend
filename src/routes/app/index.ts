import { getCategories } from "@/controllers/app/categories";
import { getServices } from "@/controllers/app/services";
import { Router } from "express";

const router = Router();

router.get("/categories", getCategories);
router.get("/services", getServices);

export default router;
