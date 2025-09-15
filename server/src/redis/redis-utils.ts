import redisClient from "./redis-client";

export const getFromRedis = async (cacheKey: string) => {
  try {
    const data = await redisClient.get(cacheKey);

    if (data) {
      console.log("Данные получены из Redis");
      return JSON.parse(data as string);
    }
  } catch (error) {
    console.log("Ошибка при получении данных из Redis");
    console.error(error);
  }
};

export const saveToRedis = async (cacheKey: string, data: any, ttl = 60) => {
  try {
    await redisClient.set(cacheKey, JSON.stringify(data), {
      EX: ttl,
    });
  } catch (error) {
    console.log("Ошибка при сохранении данных в Redis");
    console.error(error);
  }

  console.log("Данные сохранены в Redis");
};
