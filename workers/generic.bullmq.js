import { Worker, Job, Queue } from "bullmq";
import { redisConnection } from "../connection.js";
export class BullMQTask {
  constructor(queueName) {
    this.queueName = queueName;
    this.redisConnection = redisConnection;
  }

  async startConsumer(consumerFunc) {
    this.worker = new Worker(
      this.queueName,
      async (job) => {
        const message = job.data;
        await consumerFunc(message);
      },
      {
        connection: this.redisConnection,
        removeOnComplete: { count: 100 },
        stalledInterval: 1000 // Check for stalled jobs every 1 second
      }
    );
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.worker.on("ready", () => {
      console.log("Worker is running.");
    });

    this.worker.on("error", (error) => {
      console.error(`Worker error: ${error}`);
    });

    this.worker.on("failed", (job, error) => {
      console.error(`Job ${job?.id} failed with error: ${error.message}`);
    });

    this.worker.on("completed", (job) => {
      console.info(`Job ${job.id} completed successfully.`);
    });
  }

  async postMessage(data) {
    const queue = new Queue(this.queueName, { connection: redisConnection });
    try {
      const createdJob = await queue.add(this.queueName, data);
      return { data: { messageId: createdJob.id, payload: createdJob.data }, status: true };
    } catch (error) {
      console.error("Error creating job queue:", error);
      return { error, status: false };
    }
  }
}
