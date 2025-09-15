import express from "express";
import helmet from "helmet";
import { FRONTEND_URL, PORT } from "./config/env";
import router from "./routes";
import errorMiddleware from "./middlewares/error-middleware";
import connectDB from "./database";
// import connectRedis from "./redis";
import validateEnv from "./config/validate-env";
import cookieParser from "cookie-parser";
import cors from "cors";
import { requestsLogger, errorsLogger } from "./middlewares/logger-middleware";
import cronService from "./services/cron-service";
import ensureDefaultRoles from "./init/ensure-default-roles";
// import updateModelService from "./services/update-model-service";
// import hookLogger from "./utils/hook-logger";

const app = express();

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: false,
    xPoweredBy: false,
  }),
);

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL as string,
  }),
);

app.use(requestsLogger);

app.use(router);

app.use(errorsLogger);

// hookLogger();

app.use(errorMiddleware);

const startApp = async () => {
  validateEnv();
  await connectDB();
  // await connectRedis();
  await ensureDefaultRoles();
  await cronService.setDailyStats();
  // await updateModelService();
  app.listen(PORT || 3000, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
};

startApp();
