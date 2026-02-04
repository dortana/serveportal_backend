import { Request, Response } from "express";
import prisma from "@/config/db";
import { z } from "zod";
import { formatZodError } from "@/utils/functions";
import crypto from "crypto";

export const signUpHandler = async (req: Request, res: Response) => {
  const signUpSchema = z.object({
    email: z
      .email({
        message: res.__("Email address is invalid"),
      })
      .min(5, {
        message: res.__("Email must must be at least 5 characters long"),
      }),
    firstName: z.string(res.__("First name is required")).min(2, {
      message: res.__("Firstname must be at least 2 characters long"),
    }),
    lastName: z.string(res.__("Last name is required")).min(2, {
      message: res.__("Lastname must must be at least 2 characters long"),
    }),
  });
  try {
    const result = signUpSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: res.__("Invalid input"),
        errors: formatZodError(result.error),
      });
    }

    const { email, firstName, lastName } = result.data;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: res.__("A user with this email already exists"),
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
      message: res.__("Internal server error"),
    });
  }
};

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
