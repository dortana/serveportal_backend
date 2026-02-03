import { signUpHandler } from "@/controllers/auth/signup";
import { signUpVerifyEmailHnadler } from "@/controllers/auth/verify";
import { Router } from "express";

const router = Router();

router.post("/signup", signUpHandler);
router.post("/verify-signup-email", signUpVerifyEmailHnadler);

export default router;
