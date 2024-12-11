import fs from 'fs';

import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

import { logger } from '../logger/logger.js';

const prisma = new PrismaClient();
const csvFilePath = '100_dataset.csv';

async function insertData() {
  try {
    let rows = [];
    let totalInserted = 0;
    const BATCH_SIZE = 1000;

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        let tags = [];
        try {
          tags = row.tags
            .replace(new RegExp('[[]"', 'g'), '')
            .split(',')
            .map((tag) => tag.trim());
        } catch (error) {
          logger.error(`Error parsing tags for row ${row}: ${error}`);
        }

        let custom_parameters = {};
        try {
          custom_parameters = JSON.parse(row.custom_parameters);
        } catch (error) {
          logger.error(`Error parsing custom parameters: ${error}`);
        }

        rows.push({
          media_id: row.id,
          title: row.title,
          status: row.status,
          media_type: row.media_type,
          duration: parseInt(row.duration, 10),
          publish_date: new Date(row.publish_date),
          tags: tags,
          custom_parameters: custom_parameters,
          created_at: new Date(row.created_at),
          updated_at: new Date(row.updated_at),
        });

        if (rows.length >= BATCH_SIZE) {
          const batch = [...rows];
          rows = [];
          insertBatch(batch).then((count) => {
            totalInserted += count;
            logger.info(`Inserted ${totalInserted} records so far.`);
          });
        }
      })
      .on('end', async () => {
        if (rows.length > 0) {
          const count = await insertBatch(rows);
          totalInserted += count;
          logger.info(`Inserted ${totalInserted} records in total.`);
        }
        await prisma.$disconnect();
      });
  } catch (error) {
    logger.error(`Error inserting data: ${error}`);
    await prisma.$disconnect();
  }
}

async function insertBatch(batch) {
  try {
    await prisma.media.createMany({ data: batch });
    return batch.length;
  } catch (error) {
    logger.error(`Error inserting batch: ${error}`);
    return 0;
  }
}

insertData();
