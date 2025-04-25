import { AnyObjectSchema } from "yup";
import { Request, Response, NextFunction } from "express";

const SchemaValidator = (schema : AnyObjectSchema) => async(req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = await schema.validate(req.body, {abortEarly: false, stripUnknown: true});
        next();
    } catch (error: any) {
        res.status(400).json({error: error.errors})
    }
}

export default SchemaValidator;