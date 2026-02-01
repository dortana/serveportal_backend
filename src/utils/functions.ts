import { ZodError } from "zod";

export const formatZodError = (error: ZodError) => {
  return error.issues.map((issue) => ({
    field: issue.path.length ? issue.path.join(".") : "body",
    message: issue.message,
  }));
};
