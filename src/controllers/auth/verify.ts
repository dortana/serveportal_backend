import { Request, Response } from "express";
import prisma from "@/config/db";
import { z } from "zod";
import { formatZodError } from "@/utils/functions";
import { createToken, tokenMaxAge } from "@/utils/jwt";
import crypto from "crypto";

export const verifyEmailSchema = z.object({
  email: z.email("Email address is invalid").min(1, "Email is required"),
  code: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must only contain numbers"),
});
export type verifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const signUpVerifyEmailHnadler = async (req: Request, res: Response) => {
  try {
    const result = verifyEmailSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: formatZodError(result.error),
      });
    }

    const { email, code } = result.data;

    const record = await prisma.verification.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return res.status(400).json({ message: "Code not found" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Code expired" });
    }

    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    if (codeHash !== record.codeHash) {
      await prisma.verification.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });

      return res.status(400).json({ message: "Invalid code" });
    }

    const { user, session } = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { email },
        data: { emailVerified: new Date() }, // Store the actual time of verification
      });

      const newSession = await tx.session.create({
        data: {
          userId: updatedUser.id,
          expiresAt: new Date(Date.now() + tokenMaxAge * 1000),
          sessionToken: crypto.randomBytes(32).toString("hex"),
          userAgent: req.headers["user-agent"] || null,
          ipAddress: req.ip || null,
        },
      });

      await tx.verification.delete({
        where: { id: record.id },
      });

      return { user: updatedUser, session: newSession };
    });

    const token = createToken({
      userId: user.id,
      role: user.role,
      sessionId: session.id,
    });

    return res.status(200).json({
      user,
      token,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
