import { PrismaClient } from "@prisma/client";
import config from "./config.js";
import IORedis from 'ioredis';

const prismaConnection = new PrismaClient({
  datasources: {
    db: {
      url: `postgresql://${config.db.user}:${config.db.pass}@${config.db.host}/${config.db.name}?connection_limit=${config.db.connectionLimit}`,
    },
  },
  log: ["info"],
});

const redisConnection = new IORedis({
  port: config.redis.port,
  host: config.redis.host,
  maxRetriesPerRequest: null
});

export { prismaConnection, redisConnection };