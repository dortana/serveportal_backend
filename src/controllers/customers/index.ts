import { getTranslator } from "@/utils/i18nContext";
import type { Request, Response } from "express";
import prisma from "@/config/db";
import logger from "@/utils/logger";

export const getMyInformation = async (req: Request, res: Response) => {
  const t = getTranslator();
  const userId = req.user?.userId!;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        emailVerified: true,
        phone: true,
        phoneVerified: true,
        role: true,
        image: true,
        status: true,
        verified: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!existingUser) {
      return res.status(409).json({
        message: t("No user found with this email"),
      });
    }

    const { id, ...rest } = existingUser;

    return res.status(200).json({
      user: { useId: id, ...rest },
    });
  } catch (error) {
    logger.error("Get user info failed", {
      error,
    });

    return res.status(500).json({
      message: t("Internal server error"),
    });
  }
};
