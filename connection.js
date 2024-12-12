import { PrismaClient } from '@prisma/client';

import config from './config.js';

const prismaConnection = new PrismaClient({
  datasources: {
    db: {
      url: `postgresql://${config.db.user}:${config.db.pass}@${config.db.host}/${config.db.name}?connection_limit=${config.db.connectionLimit}`,
    },
  },
  log: ['info'],
});

export { prismaConnection };
