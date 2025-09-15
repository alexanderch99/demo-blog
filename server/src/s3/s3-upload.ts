import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { lookup as mimeLookup } from "mime-types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import S3Client from "./index";
import { S3_BUCKET_NAME, S3_URL } from "../config/env";

type UploadOptions = {
  filePath: string;
  filename?: string;
  keyPrefix?: string;
  contentType?: string;
};

export async function uploadFileToS3({
  filePath,
  filename,
  keyPrefix = "",
  contentType,
}: UploadOptions) {
  const ext = path.extname(filename ?? filePath).toLowerCase();
  const key =
    (keyPrefix ? keyPrefix.replace(/\/?$/, "/") : "") +
    randomUUID() +
    (ext || "");
  const ct =
    contentType || (mimeLookup(ext) as string) || "application/octet-stream";

  const buffer = await fs.readFile(filePath);

  const maxRetries = 3;
  let attempt = 0;
  let lastError: unknown;

  while (attempt < maxRetries) {
    try {
      await S3Client.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: ct,
          ACL: "public-read",
          CacheControl: "public, max-age=31536000",
        }),
      );
      return publicUrlForKey(key);
    } catch (err) {
      lastError = err;
      attempt++;
      if (attempt < maxRetries) {
        const delay = 500 * Math.pow(2, attempt - 1);
        console.warn(`Попытка ${attempt} не удалась, повтор через ${delay}мс`);
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }

  throw new Error(
    `Не удалось загрузить файл после ${maxRetries} попыток: ${String(
      lastError,
    )}`,
  );
}

function publicUrlForKey(key: string) {
  if (S3_URL) {
    return `${S3_URL.replace(/\/+$/, "")}/${encodeURI(key)}`;
  }
}
