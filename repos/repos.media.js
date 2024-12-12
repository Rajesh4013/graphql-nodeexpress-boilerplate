import { prismaConnection as prisma } from '../connection.js';
import { logger } from '../logger/logger.js';

export async function fetchMediaItems() {
  try {
    return await prisma.$queryRaw`SELECT * FROM "Media" m;`;
  } catch (err) {
    logger.error(`Error fetching media items: ${err}`);
    return [];
  }
}

export async function fetchMediaItemById(media_id) {
  try {
    const media =
      await prisma.$queryRaw`SELECT * FROM "Media" m WHERE m."media_id" = ${media_id}`;
    return media[0];
  } catch (err) {
    logger.error(`Error fetching media item by ID: ${err}`);
    return null;
  }
}

export async function fetchDynamicMediaItems(playlistConfig) {
  const {
    tags,
    customParameters,
    pageNumber = 1,
    itemsPerPage = 500,
    sort,
  } = playlistConfig;

  try {
    let query = `SELECT m."media_id" FROM "Media" m WHERE 1=1`;

    if (tags?.include) {
      query += ` AND m."tags" @> ARRAY${JSON.stringify(tags.include).replaceAll('"', "'")}::text[]`;
    }

    if (tags?.exclude) {
      query += ` AND NOT (m."tags" && ARRAY['${tags.exclude}']::text[])`;
    }

    if (customParameters?.include) {
      Object.entries(customParameters.include).forEach(([key, value]) => {
        query += ` AND m."custom_parameters" @> '{"${key}": "${value}"}'`;
      });
    }

    if (customParameters?.exclude) {
      Object.entries(customParameters.exclude).forEach(([key, value]) => {
        query += ` AND NOT m."custom_parameters" @> '{"${key}": "${value}"}'`;
      });
    }

    if (sort?.field && sort?.order) {
      query += ` ORDER BY m."${sort.field}" ${sort.order}`;
    }

    query += ` LIMIT ${itemsPerPage} OFFSET ${(pageNumber - 1) * itemsPerPage}`;

    const playlistPreview = await prisma.$queryRawUnsafe(query);

    return playlistPreview;
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`Error fetching playlist preview: ${err.message}`);
    } else {
      logger.error(`Unknown error occurred: ${err}`);
    }
    return [];
  }
}
