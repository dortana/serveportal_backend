import { getCustomers } from "@/controllers/admin";
import { Router } from "express";

const router = Router();

router.get("/users", getCustomers);

export default router;
