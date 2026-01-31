import { Router } from "express";

import authRoutes from "./auth";
import customerRoutes from "./customers";
import expertRoutes from "./experts";
import adminRoutes from "./admin";
import appRoutes from "./app";

const router = Router();

router.use("/auth", authRoutes);
router.use("/customers", customerRoutes);
router.use("/experts", expertRoutes);
router.use("/admin", adminRoutes);
router.use("/app", appRoutes);

export default router;
