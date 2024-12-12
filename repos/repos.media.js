import { prismaConnection as prisma } from '../connection.js';
import { logger } from '../logger/logger.js';

export async function fetchMediaItems() {
  try {
    return await prisma.$queryRaw`SELECT 
      media_id,
      title,
      status,
      media_type,
      duration,
      publish_date,
      tags,
      custom_parameters,
      created_at,
      updated_at
    FROM "Media" m;`;
  } catch (err) {
    logger.error(`Error fetching media items: ${err}`);
    return [];
  }
}

export async function fetchMediaItemById(media_id) {
  try {
    const media = await prisma.$queryRaw`SELECT 
      media_id,
      title,
      status,
      media_type,
      duration,
      publish_date,
      tags,
      custom_parameters,
      created_at,
      updated_at
    FROM "Media" m WHERE m."media_id" = ${media_id}`;
    return media[0];
  } catch (err) {
    logger.error(`Error fetching media item by ID: ${err}`);
    return null;
  }
}

export async function fetchDynamicMediaIds(playlistConfig) {
  const {
    tags,
    customParameters,
    pageNumber = 1,
    itemsPerPage = 500,
    sort,
  } = playlistConfig;

  const customParamsInclude = customParameters?.include
    ? Object.values(customParameters.include)
        .map((param) => param.replaceAll(" ", " & "))
        .join(" & ")
    : "";

  const customParamsExclude = customParameters?.exclude
    ? Object.values(customParameters.exclude)
        .map((param) => `!${param.replaceAll(" ", " & ")}`)
        .join(" & ")
    : "";

  const tagsInclude = tags?.include
    ? tags.include.map((tag) => tag.replaceAll(" ", " & ")).join(" & ")
    : "";

  const tagsExclude = tags?.exclude
    ? tags.exclude.map((tag) => `!${tag.replaceAll(" ", " & ")}`).join(" & ")
    : "";

  const customParamsQuery = [customParamsInclude, customParamsExclude]
    .filter(Boolean)
    .join(' & ');

  const tagsQuery = [tagsInclude, tagsExclude].filter(Boolean).join(' & ');

  const searchQuery = [customParamsQuery, tagsQuery]
    .filter(Boolean)
    .join(' & ');

  try {
    let query = `
    SELECT
      ARRAY(
        SELECT m.media_id
        FROM "Media" m
        WHERE 1 = 1
        ${searchQuery ? `AND m.searchable @@ to_tsquery('english', '${searchQuery.replace(/'/g, "''")}')` : ''}
        ${sort?.field ? `ORDER BY m."${sort.field}" ${sort?.order || 'ASC'}` : ''}
        LIMIT ${itemsPerPage} OFFSET ${(pageNumber - 1) * itemsPerPage}
      ) AS media_ids;
  `;

    const result = await prisma.$queryRawUnsafe(query);
    return result[0]?.media_ids || [];

  } catch (err) {
    if (err instanceof Error) {
      logger.error(`Error fetching playlist preview: ${err.message}`);
    } else {
      logger.error(`Unknown error occurred: ${err}`);
    }
    return [];
  }
}
