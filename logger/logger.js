import path from 'path';
import { fileURLToPath } from 'url';
import pino from 'pino';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFilePath = path.join(__dirname, 'app.log');

const prettyTransport = pino.transport({
  target: 'pino-pretty',
  options: { colorize: true, translateTime: true },
});

const fileTransport = pino.destination({
  dest: logFilePath,
  sync: false,
});

const streams = [{ stream: prettyTransport }, { stream: fileTransport }];

const logger = pino({ level: 'info' }, pino.multistream(streams));

export { logger };
