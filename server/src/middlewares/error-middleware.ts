/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/custom-error";
import { isCelebrateError, Segments, CelebrateError } from "celebrate";
import { MulterError } from "multer";

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log(err);
  if (err instanceof MulterError) {
    const multerErrorMessages = {
      LIMIT_PART_COUNT: "Слишком много частей в запросе",
      LIMIT_FILE_SIZE: "Вес файла слишком большой",
      LIMIT_FILE_COUNT: "Слишком много файлов",
      LIMIT_FIELD_KEY: "Имя поля слишком длинное",
      LIMIT_FIELD_VALUE: "Значение поля слишком длинное",
      LIMIT_FIELD_COUNT: "Слишком много полей",
      LIMIT_UNEXPECTED_FILE: "Неожиданный файл",
    } as any;
    const message = multerErrorMessages[err.code] || "Ошибка загрузки файла";

    return res.status(400).json({ message });
  }

  if (isCelebrateError(err)) {
    const celebrateErr = err as CelebrateError;
    const result: any = {};

    for (const [segment, joiError] of celebrateErr.details) {
      result[segment as Segments] = joiError.details.map(d => ({
        message: d.message,
        path: d.path.join("."),
        type: d.type,
      }));
    }

    console.log(result);

    const validationErrMessage = `Ошибка валидации поля ${result.body[0].path}: ${result.body[0].message}`;

    return res.status(400).json({
      message: validationErrMessage,
    });
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.serializeError());
  } else {
    return res.status(500).json({ message: err.message || "Произошла ошибка" });
  }
};
