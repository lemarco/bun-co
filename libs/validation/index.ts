import { ZodError, z } from "zod";
import { fromZodError } from "zod-validation-error";
export type ValidationResult<T> = {
  data?: T;
  error: boolean;
  message?: string;
};
export const validate = <T>(
  object: Record<string, unknown>,
  schema: z.ZodObject<any>
): ValidationResult<T> => {
  try {
    const data = schema.parse(object) as T;
    return {
      error: false,
      data,
    };
  } catch (err) {
    const validationError = fromZodError(err as unknown as ZodError);
    return {
      error: true,
      message: validationError.toString(),
    };
  }
};
