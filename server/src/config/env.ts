import "dotenv/config";

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const REDIS_URI = process.env.REDIS_URI;
export const JWT_ACCESS = process.env.JWT_ACCESS;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const DEFAULT_ROLE_ID = process.env.DEFAULT_ROLE_ID;
export const JWT_EXPIRES = process.env.JWT_EXPIRES;
export const S3_REGION = process.env.S3_REGION;
export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
export const S3_ENDPOINT = process.env.S3_ENDPOINT;
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
export const S3_URL = process.env.S3_URL;
