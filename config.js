import dotenv from "dotenv";

dotenv.config();

const config = {
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    pass: process.env.DB_PASS || "postgres",
    name: process.env.DB_NAME || "dsp",
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "5"),
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || "6379",
  },
  queueName: process.env.QUEUE_NAME || "graphql-queue",
};

export default config;