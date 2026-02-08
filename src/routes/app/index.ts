import { getCategories } from "@/controllers/app/categories";
import { getLocations } from "@/controllers/app/locations";
import { getServices } from "@/controllers/app/services";
import { Router } from "express";

const router = Router();

router.get("/categories", getCategories);
router.get("/services", getServices);
router.get("/locations", getLocations);

export default router;
