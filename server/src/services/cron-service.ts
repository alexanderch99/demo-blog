import cron from "node-cron";
import PostModel from "../models/post-model";
import UserModel from "../models/user-model";
import DailyStatsModel from "../models/daily-stats-model";

class CronService {
  async setDailyStats() {
    (async () => {
      cron.schedule(
        "59 23 * * *",
        async () => {
          try {
            console.log("Запуск задачи статистики:", new Date());

            const postsCount = await PostModel.countDocuments({
              hidden: false,
            });
            const usersCount = await UserModel.countDocuments();

            await DailyStatsModel.create({
              date: Date.now(),
              postsCount,
              usersCount,
            });

            console.log(
              `Статистика сохранена: ${postsCount} постов, ${usersCount} пользователей`,
            );
          } catch (error) {
            console.error("Ошибка при сохранении статистики:", error);
          }
        },
        {
          timezone: "Europe/Moscow",
        },
      );
    })();
  }
}

export default new CronService();
