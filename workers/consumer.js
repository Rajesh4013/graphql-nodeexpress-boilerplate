import { bullMQTask } from "../app.js";
import { processJob } from "../utils/utils.handleJob.js";


function startWorker() {
  bullMQTask.startConsumer(processJob)
}

export { startWorker };