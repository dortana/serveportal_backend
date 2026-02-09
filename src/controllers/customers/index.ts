import { getTranslator } from "@/utils/i18nContext";
import type { Request, Response } from "express";
import prisma from "@/config/db";
import logger from "@/utils/logger";

export const getCustomers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};
