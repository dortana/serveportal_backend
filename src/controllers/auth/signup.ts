import { Request, Response } from "express";
import prisma from "@/config/db";
import { z } from "zod";
import { formatZodError } from "@/utils/functions";
import crypto from "crypto";
import { getTranslator } from "@/utils/i18nContext";

export const signUpHandler = async (req: Request, res: Response) => {
  const t = getTranslator();
  const signUpSchema = z.object({
    email: z
      .email({
        message: t("Email address is invalid"),
      })
      .min(5, {
        message: t("Email must must be at least 5 characters long"),
      }),
    firstName: z.string(t("First name is required")).min(2, {
      message: t("Firstname must be at least 2 characters long"),
    }),
    lastName: z.string(t("Last name is required")).min(2, {
      message: t("Lastname must must be at least 2 characters long"),
    }),
  });
  try {
    const result = signUpSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: t("Invalid input"),
        errors: formatZodError(result.error),
      });
    }

    const { email, firstName, lastName } = result.data;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: t("A user with this email already exists"),
      });
    }

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
      },
    });

    const code = generateCode();
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    await prisma.verification.create({
      data: {
        email,
        codeHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      },
    });

    return res.status(201).json({
      user,
      code, // TODO: remove later
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: t("Internal server error"),
    });
  }
};

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
