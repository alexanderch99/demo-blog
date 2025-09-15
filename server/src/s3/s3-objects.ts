import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import S3Client from "./index";

import { S3_BUCKET_NAME } from "../config/env";

export async function listBucketObjects() {
  const command = new ListObjectsV2Command({
    Bucket: S3_BUCKET_NAME,
  });

  try {
    const data = await S3Client.send(command);
    return data.Contents || [];
  } catch (error) {
    console.error("Ошибка при получении объектов из S3:", error);
    throw error;
  }
}
