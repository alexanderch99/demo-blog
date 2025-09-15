import { celebrate, Joi, Segments } from "celebrate";

const stringPatternBaseMsgC =
  "заголовок поста должен содержать только буквы, цифры, пробелы, -, _ и .";
const stringPatternC = new RegExp(/^[a-zA-Zа-яА-Я0-9_\-\. ]+$/);

export const validatePost = celebrate({
  [Segments.BODY]: {
    title: Joi.string()
      .trim()
      .pattern(stringPatternC)
      .custom(v => v.replace(/\s{2,}/g, " "), "удаление лишних пробелов")
      .min(1)
      .max(50)
      .required()
      .messages({
        "string.base": "заголовок поста должен быть строкой",
        "string.empty": "заголовок поста обязателен",
        "string.min": "минимальная длина заголовка поста — 1 символ",
        "string.max": "максимальная длина заголовка поста — 50 символов",
        "any.required": "заголовок поста обязателен",
        "string.pattern.base": stringPatternBaseMsgC,
      }),
    body: Joi.string().trim().min(1).max(9999).required().messages({
      "string.base": "тело поста должно быть строкой",
      "string.empty": "тело поста обязательно",
      "string.min": "минимальная длина тела поста — 1 символ",
      "string.max": "максимальная длина тела поста — 9999 символов",
      "any.required": "тело поста обязательно",
    }),
    tags: Joi.array()
      .items(
        Joi.string().trim().min(1).max(32).messages({
          "string.base": "тег должен быть строкой",
          "string.min": "минимальная длина тега — 1 символ",
          "string.max": "максимальная длина тега — 32 символа",
          "string.empty": "тег не должен быть пустым",
        }),
      )
      .max(5)
      .unique((a, b) => a.toLowerCase() === b.toLowerCase())
      .messages({
        "array.base": "список тегов должен быть массивом",
        "array.max": "не больше 5 тегов",
        "array.unique": "теги не должны повторяться",
      }),
    id: Joi.string(),
    blogId: Joi.string(),
    postId: Joi.string(),
    nicknameSlug: Joi.string(),
  },
});
