import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { existsSync, mkdirSync } from "node:fs";
import path from "path";
import { randomUUID } from "crypto";
import { allowedImgMimeTypes } from "../utils/constants";

const pathToUpload = path.join(__dirname, "../../uploads/blog-covers");

if (!existsSync(path.resolve(pathToUpload))) {
  try {
    mkdirSync(path.resolve(pathToUpload), {
      recursive: true,
    });
  } catch (error) {
    throw new Error(error as string);
  }
}

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pathToUpload);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname +
        "_" +
        randomUUID() +
        "." +
        file.mimetype.split("/")[1],
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (allowedImgMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadBlogCover = multer({
  storage: storageConfig,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("blog-cover");

export default uploadBlogCover;
