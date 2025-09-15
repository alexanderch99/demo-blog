import mongoose from "mongoose";
import { MONGO_URI } from "../config/env";

export default async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("Подключении к базе данных успешно");
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при подключении к базе данных");
  }
}
