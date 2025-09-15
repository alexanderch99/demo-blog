import redisClient from "./redis-client";

export default async function connectRedis() {
  redisClient.on("error", error => {
    console.log("Ошибка подключения к Redis");
    console.error(error);
  });

  redisClient.on("connect", () => {
    console.log("Подключение к Redis успешно");
  });

  await redisClient.connect();
}
