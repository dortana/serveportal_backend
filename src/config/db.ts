import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var __prisma: ReturnType<typeof createPrismaClient> | undefined;
}

function createPrismaClient() {
  const accelerateUrl = process.env.DATABASE_URL;

  if (!accelerateUrl) {
    throw new Error(
      'DATABASE_URL must be defined when using engineType="client"',
    );
  }

  const client = new PrismaClient({
    accelerateUrl,
  });

  return client.$extends(withAccelerate());
}

function getPrisma() {
  if (!global.__prisma) {
    global.__prisma = createPrismaClient();
  }
  return global.__prisma;
}

const prisma = new Proxy({} as ReturnType<typeof getPrisma>, {
  get(_target, prop) {
    const client = getPrisma();
    const value = client[prop as keyof typeof client];

    if (typeof value === "function") {
      return value.bind(client);
    }

    return value;
  },
});

export default prisma;
