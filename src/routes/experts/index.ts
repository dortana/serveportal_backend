import { getCustomers } from "@/controllers/experts";
import { Router } from "express";

const router = Router();

router.get("/", getCustomers);

export default router;
