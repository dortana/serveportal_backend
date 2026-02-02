import { getCustomers } from "@/controllers/admin";
import { UserRole } from "@/generated/prisma/enums";
import requiresAuth from "@/middlewares/auth";
import { Router } from "express";

const router = Router();

// everything below this line is protected
router.use(requiresAuth(UserRole.ADMIN));

router.get("/users", getCustomers);

export default router;
