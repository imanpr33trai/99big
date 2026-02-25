import { NextFunction, Request, Response } from "express";
import z, { ZodError, ZodType } from "zod";

// ============================================================================
// TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  success: false;
  message: string;
  errors: ValidationError[];
  code: "VALIDATION_ERROR";
}

// ============================================================================
// MAIN VALIDATION MIDDLEWARE
// ============================================================================

/**
 * Creates a validation middleware for a specific Zod schema
 * @param schema - Zod schema to validate against
 * @param source - Request property to validate (body, query, params)
 */
export const validate = <T>(schema: ZodType<T>, source: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dataToValidate = req[source];
      const result = schema.parse(dataToValidate);

      // Replace with parsed data (applies defaults, transforms)
      req[source] = result;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ValidationError[] = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        const response: ValidationErrorResponse = {
          success: false,
          message: "Validation failed",
          errors,
          code: "VALIDATION_ERROR",
        };

        res.status(400).json(response);
        return;
      }

      // Unexpected error
      next(error);
    }
  };
};

// ============================================================================
// CONVENIENCE MIDDLEWARES
// ============================================================================

/**
 * Validates request body
 */
export const validateBody = <T>(schema: ZodType<T>) => validate(schema, "body");

/**
 * Validates query parameters
 */
export const validateQuery = <T>(schema: ZodType<T>) => validate(schema, "query");

/**
 * Validates URL parameters
 */
export const validateParams = <T>(schema: ZodType<T>) => validate(schema, "params");

// ============================================================================
// STRICT VALIDATION (Rejects unknown keys)
// ============================================================================

export const validateStrict = <T>(
  schema: ZodType<T>,
  source: "body" | "query" | "params" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const strictSchema = schema instanceof z.ZodObject ? schema.strict() : schema;
      const result = strictSchema.parse(req[source]);

      req[source] = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
          code: "VALIDATION_ERROR",
        });
        return;
      }
      next(error);
    }
  };
};

export const middlewareValidate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = {
        ...req.body,
        ...req.query,
        ...req.params,
      };

      const result = schema.parse(data);
      (req as any).validatedData = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
        res.status(400).json({
          message: "Validation failed",
          errors: messages,
          status: false,
          timeStamp: helperGetCurrentTimestamp(),
        });
        return;
      }
      next(error);
    }
  };
};
