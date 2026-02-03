import { Request, Response, NextFunction } from "express";
import { decodeToken } from "@/utils/jwt";
import { UserRole } from "@/generated/prisma/enums";
import prisma from "@/config/db";

const requiresAuth =
  (...allowedRoles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decodedData = decodeToken(token);

      const activeSession = await prisma.session.findUnique({
        where: { id: decodedData.sessionId },
      });

      if (!activeSession) {
        return res.status(401).json({ message: "Session expired or revoked" });
      }

      if (activeSession.expiresAt < new Date()) {
        await prisma.session.delete({ where: { id: activeSession.id } });
        return res.status(401).json({ message: "Session expired" });
      }

      //@ts-ignore
      req.user = decodedData;
      if (allowedRoles.length) {
        const role = decodedData.role;

        if (!role || !allowedRoles.includes(role)) {
          return res.status(403).json({ message: "Forbidden" });
        }
      }

      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };

export default requiresAuth;
