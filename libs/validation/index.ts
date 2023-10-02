import { ZodError, z } from "zod";
import { fromZodError } from "zod-validation-error";
import { Err, Ok, Result } from "../utils/result";
import { ErrorData, getBadRequestError } from "../error";
export type ValidationResult<T> = {
  data?: T;
  error: boolean;
  message?: string;
};
const validate = <T>(
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
export const validateEntity = <T>(
  entity: Record<string, unknown>,
  schema: z.ZodObject<any>,
  logger: { info: (val: any) => void }
): Result<T, ErrorData> => {
  if (schema) {
    const bodyValidationResult = validate(entity as any, schema as any);
    if (bodyValidationResult.error) {
      logger?.info(bodyValidationResult.message);
      return Err(getBadRequestError());
    }
    return Ok(bodyValidationResult.data as T);
  }
  return Ok(entity as T);
};
