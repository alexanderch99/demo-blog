import { S3Client } from "@aws-sdk/client-s3";

import {
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_ENDPOINT,
} from "../config/env";

export default new S3Client({
  region: S3_REGION as string,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID as string,
    secretAccessKey: S3_SECRET_ACCESS_KEY as string,
  },
  endpoint: S3_ENDPOINT as string,
  forcePathStyle: true,
  apiVersion: "latest",
});
