import { getMyInformation } from "@/controllers/customers";
import { logoutHandler } from "@/controllers/customers/logout";
import { UserRole } from "@/generated/prisma/enums";
import requiresAuth from "@/middlewares/auth";
import { Router } from "express";

const router = Router();

// everything below this line is protected
router.use(requiresAuth(UserRole.CUSTOMER));

router.get("/me", getMyInformation);
router.get("/logout", logoutHandler);

export default router;
