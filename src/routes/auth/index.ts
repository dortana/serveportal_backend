import { signUpHandler } from "@/controllers/auth/signup";
import { Router } from "express";

const router = Router();

router.post("/signup", signUpHandler);

export default router;
