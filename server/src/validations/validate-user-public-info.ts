import { celebrate, Joi, Segments } from "celebrate";

const stringPatternBaseMsgC =
  "название должно содержать только буквы, цифры, пробелы, -, _ и .";
const stringPatternC = new RegExp(/^[a-zA-Zа-яА-Я0-9_\-\. ]+$/);

export const validateUserPublicInfo = celebrate({
  [Segments.BODY]: {
    id: Joi.string()
      .trim()
      .custom(
        v => v.toLowerCase().replace(/\s{2,}/g, " "),
        "приведение к нижнему регистру и удаление лишних пробелов",
      )
      .min(2)
      .max(64)
      .required()
      .messages({
        "string.base": "id должен быть строкой",
        "string.empty": "id обязателен",
        "string.min": "минимальная длина idа — 2 символа",
        "string.max": "максимальная длина idа — 64 символа",
        "any.required": "id обязателен",
      }),
    nickname: Joi.string()
      .trim()
      .pattern(stringPatternC)
      .custom(v => v.replace(/\s{2,}/g, " "), "удаление лишних пробелов")
      .min(2)
      .max(32)
      .required()
      .messages({
        "string.base": "никнейм должен быть строкой",
        "string.empty": "никнейм обязателен",
        "string.min": "минимальная длина никнейма — 2 символа",
        "string.max": "максимальная длина никнейма — 32 символа",
        "any.required": "никнейм обязателен",
        "string.pattern.base": stringPatternBaseMsgC,
      }),
    bio: Joi.string().min(0).max(400).required().messages({
      "string.base": "описание должно быть строкой",
      "string.max": "максимальная длина описания — 400 символов",
      "any.required": "описание обязательно",
    }),
    location: Joi.string().min(0).max(99).required().messages({
      "string.base": "локация должна быть строкой",
      "string.max": "максимальная длина локации — 99 символов",
      "any.required": "локация обязательна",
    }),
    links: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().trim().min(1).max(32).required().messages({
            "string.base": "название ссылки должно быть строкой",
            "string.min": "минимальная длина названия — 1 символ",
            "string.max": "максимальная длина названия — 32 символа",
            "any.required": "название ссылки обязательно",
            "string.empty": "название ссылки не должно быть пустым",
          }),
          link: Joi.string()
            .trim()
            .lowercase()
            .min(1)
            .max(199)
            .pattern(/^https?:\/\/.+$/)
            .required()
            .messages({
              "string.base": "ссылка должна быть строкой",
              "string.min": "минимальная длина ссылки — 1 символ",
              "string.max": "максимальная длина ссылки — 199 символов",
              "string.pattern.base": "ссылка должна начинаться с http/https",
              "any.required": "ссылка обязательна",
              "string.empty": "ссылка не должна быть пустой",
            }),
        }),
      )
      .max(10)
      .unique((a, b) => a.name === b.name)
      .unique((a, b) => a.link === b.link)
      .required()
      .messages({
        "array.base": "ссылки должны быть массивом",
        "array.max": "не больше 10 ссылок",
        "array.unique": "имена ссылок и/или ссылки не должны повторяться",
        "any.required": "массив ссылок обязателен",
      }),
    interests: Joi.array()
      .items(
        Joi.string().trim().min(1).max(32).messages({
          "string.base": "интерес должен быть строкой",
          "string.min": "минимальная длина интереса — 1 символ",
          "string.max": "максимальная длина интереса — 32 символа",
          "string.empty": "интерес не должен быть пустым",
        }),
      )
      .max(10)
      .unique((a, b) => a.toLowerCase() === b.toLowerCase())
      .messages({
        "array.base": "список интересов должен быть массивом",
        "array.max": "не больше 10 интересов",
        "array.unique": "интересы не должны повторяться",
      }),
    avatarUrl: Joi.string().min(0).max(199).required().messages({
      "string.base": "ссылка на аватар должна быть строкой",
      "string.max": "максимальная длина ссылки на аватар — 199 символов",
      "any.required": "ссылка на аватар обязательна",
    }),
  },
});
