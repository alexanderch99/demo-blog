import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import S3Client from "./index";
import { S3_BUCKET_NAME } from "../config/env";

export async function deleteFileFromS3(key: string) {
  await S3Client.send(
    new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    }),
  );

  return true;
}
