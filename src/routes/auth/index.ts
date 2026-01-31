import { getCustomers } from "@/controllers/auth";
import { Router } from "express";

const router = Router();

router.get("/", getCustomers);

export default router;
