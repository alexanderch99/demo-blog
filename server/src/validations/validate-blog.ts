import { celebrate, Joi, Segments } from "celebrate";

const stringPatternBaseMsgC =
  "заголовок блога должен содержать только буквы, цифры, пробелы, -, _ и .";
const stringPatternC = new RegExp(/^[a-zA-Zа-яА-Я0-9_\-\. ]+$/);

export const validateBlog = celebrate({
  [Segments.BODY]: {
    title: Joi.string()
      .trim()
      .pattern(stringPatternC)
      .custom(v => v.replace(/\s{2,}/g, " "), "удаление лишних пробелов")
      .min(1)
      .max(50)
      .required()
      .messages({
        "string.base": "заголовок блога должен быть строкой",
        "string.empty": "заголовок блога обязателен",
        "string.min": "минимальная длина заголовка блога — 1 символ",
        "string.max": "максимальная длина заголовка блога — 50 символов",
        "any.required": "заголовок блога обязателен",
        "string.pattern.base": stringPatternBaseMsgC,
      }),
    id: Joi.string(),
    blogId: Joi.string(),
    nicknameSlug: Joi.string(),
  },
});
