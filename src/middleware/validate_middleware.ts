import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validateSchema = (schema: ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next(); 
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Dados de entrada inválidos",
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};