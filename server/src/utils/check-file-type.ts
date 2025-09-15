import { fileTypeFromFile } from "file-type";
import { rm } from "node:fs/promises";
import BadRequestError from "../errors/bad-request-error";

const checkFileType = async (
  filePath: string,
  allowedExtensions: Array<string>,
) => {
  const fileType = await fileTypeFromFile(filePath);
  if (!fileType || !allowedExtensions.includes(fileType.ext.toLowerCase())) {
    console.log(fileType);
    await rm(filePath);
    throw new BadRequestError("Недопустимый файл");
  }
  return fileType;
};

export default checkFileType;
