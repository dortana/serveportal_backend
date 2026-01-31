import { getCustomers } from "@/controllers/app";
import { Router } from "express";

const router = Router();

router.get("/", getCustomers);

export default router;
