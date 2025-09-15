import { celebrate, Joi, Segments } from "celebrate";

const stringPatternBaseMsg =
  "название должно содержать только латинские буквы, цифры, пробелы, -, _ и .";
const stringPatternBaseMsgC =
  "название должно содержать только буквы, цифры, пробелы, -, _ и .";
const stringPattern = new RegExp(/^[a-zA-Z0-9_\-\. ]+$/);
const stringPatternC = new RegExp(/^[a-zA-Zа-яА-Я0-9_\-\. ]+$/);

export const validateRoleBody = celebrate({
  [Segments.BODY]: {
    name: Joi.string()
      .trim()
      .custom(v => v.toLowerCase(), "приведение к нижнему регистру")
      .pattern(stringPattern)
      .required()
      .min(1)
      .max(32)
      .messages({
        "string.base": "название должно быть строкой",
        "any.required": "название группы обязательно",
        "string.empty": "название группы обязательно",
        "string.min": "минимум 1 символ",
        "string.max": "максимум 32 символа",
        "string.pattern.base": stringPatternBaseMsg,
      }),
    displayName: Joi.string()
      .trim()
      .pattern(stringPatternC)
      .required()
      .min(1)
      .max(32)
      .messages({
        "string.base": "название должно быть строкой",
        "any.required": "название группы обязательно",
        "string.empty": "название группы обязательно",
        "string.min": "минимум 1 символ",
        "string.max": "максимум 32 символа",
        "string.pattern.base": stringPatternBaseMsgC,
      }),
    isAdmin: Joi.boolean().required().messages({
      "boolean.base": "допускается только true или false",
      "any.required": "true или false обязательно",
    }),
    priority: Joi.number().integer().required().min(12).max(98).messages({
      "number.base": "значение должно быть числовым",
      "number.integer": "значение должно быть целым числом",
      "any.required": "значение обязательно",
      "number.min": "значение не должно быть ниже 12",
      "number.max": "значение не должно быть выше 98",
    }),
    // permissions: Joi.array()
    //   .items(
    //     Joi.string()
    //       .trim()
    //       .custom(
    //         v => v.toLowerCase().replace(/\s{2,}/g, " "),
    //         "приведение к нижнему регистру и удаление лишних пробелов",
    //       )
    //       .pattern(stringPattern),
    //   )
    //   .unique()
    //   .min(1)
    //   .max(99)
    //   .required()
    //   .messages({
    //     "array.base": "список прав должен быть массивом",
    //     "string.base": "все значения должны быть строками",
    //     "string.empty": "право не должно быть пустым",
    //     "array.unique": "все права должны быть уникальными",
    //     "array.includes": "все значения должны быть строками",
    //     "array.min": "должно быть установлено как минимум 1 право",
    //     "array.max": "максимум 99 прав",
    //     "any.required": "значение обязательно",
    //     "string.pattern.base": stringPatternBaseMsg,
    //   }),
  },
});
