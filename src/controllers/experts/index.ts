import type { Request, Response } from "express";

export const getCustomers = async (req: Request, res: Response) => {
  res.json([
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
  ]);
};
