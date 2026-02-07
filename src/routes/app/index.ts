import { getCategories } from "@/controllers/app";
import { Router } from "express";

const router = Router();

router.get("/categories", getCategories);

export default router;
