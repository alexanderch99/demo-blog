import { celebrate, Joi, Segments } from "celebrate";

const passwordPattern = new RegExp(
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{12,32}$/,
);

export const validateAuth = celebrate({
  [Segments.BODY]: {
    email: Joi.string()
      .trim()
      .custom(
        v => v.toLowerCase().replace(/\s{2,}/g, " "),
        "приведение к нижнему регистру и удаление лишних пробелов",
      )
      .required()
      .min(4)
      .max(99)
      .messages({
        "string.base": "логин должен быть строкой",
        "any.required": "логин обязателен",
        "string.empty": "логин обязателен",
        "string.min": "минимальная длина логина - 4 символа",
        "string.max": "максимальная длина логина - 99 символов",
      }),
    password: Joi.string()
      .required()
      .min(12)
      .max(32)
      .pattern(passwordPattern)
      .messages({
        "string.base": "пароль должен быть строкой",
        "any.required": "пароль обязателен",
        "string.empty": "пароль обязателен",
        "string.min": "пароль должен быть минимум 12 символов",
        "string.max": "пароль не должен быть длинее 32 символов",
        "string.pattern.base":
          "пароль должен содержать минимум одну заглавную, одну строчную латинскую букву, одну цифру и один спецсимвол",
      }),
    role: Joi.string().messages({
      "string.base": "группа быть строкой",
    }),
  },
});
