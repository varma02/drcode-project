import express from 'express';
import { BadRequestError, BaseError, ErrorCode, FieldsInvalidError, Forbidden, NotFoundError } from './errors';
import { ResponseError } from 'surrealdb';

export default function errorHandler(func : express.RequestHandler) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await func(req, res, next);
    } catch (err: any) {
      let code = "", message = "";
      if (err instanceof BaseError) {
        code = err.code;
        message = err.message;
      } else if (err instanceof ResponseError) {
        if (err.message.match(/Found.+for field.+with record.+but/gmi)) {
          err = new FieldsInvalidError(err.message);
        } else if (err.message.match(/The query was not executed due to a failed transaction/gmi)) {
          err = new BadRequestError(err.message);
        } else if (err.message.match(/Expected a single result output when using the ONLY keyword/gmi)) {
          err = new NotFoundError(err.message);
        } else if (err.message.match(/x-permission-denied/gmi)) {
          err = new Forbidden();
        } else {
          console.trace(err);
        }
      } else {
        console.trace(err);
      }
      if (!message?.length) message = err?.message || "An unexpected error occurred.";
      if (!code?.length) code = err?.code || ErrorCode.ServerError;
      res.status(400).json({ code, message });
    }
  };
}