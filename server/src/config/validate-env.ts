const REQUIRED_ENV_VARS = [
  "PORT",
  "MONGO_URI",
  "REDIS_URI",
  "JWT_ACCESS",
  "FRONTEND_URL",
  "DEFAULT_ROLE_ID",
  "JWT_EXPIRES",
  "S3_REGION",
  "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY",
  "S3_SECRET_ACCESS_KEY",
  "S3_ENDPOINT",
  "S3_BUCKET_NAME",
  "S3_URL",
];

export default function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Отсутствуют обязательные переменные окружения: ${missing.join(", ")}`,
    );
  }

  console.log("Переменные окружения валидны");
}
