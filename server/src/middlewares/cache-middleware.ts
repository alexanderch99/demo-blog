import { NextFunction, Request, Response } from "express";
import { getFromRedis } from "../redis/redis-utils";

export default (ttl = 60) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cacheKey = req.originalUrl;

      const cachedData = await getFromRedis(cacheKey);

      if (cachedData) {
        res.json(cachedData);
        return;
      }

      res.locals.cacheKey = cacheKey;
      res.locals.ttl = ttl;

      next();
    } catch (error) {
      next(error);
    }
  };
