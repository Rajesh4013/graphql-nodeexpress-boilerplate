import { prismaConnection as prisma } from "../connection.js";

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
    console.error("Error fetching media items:", err);
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
    console.error("Error fetching media item by ID:", err);
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

  const customParamsQuery = `${customParamsInclude} & ${customParamsExclude}`;
  const tagsQuery = `${tagsInclude} & ${tagsExclude}`;
  const searchQuery = `${customParamsQuery} & ${tagsQuery}`;

  try {
    let query = `SELECT
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
    FROM
      "Media" m
    WHERE 1 = 1`;

    if (searchQuery) {
      const sanitizedQuery = searchQuery.replace(/'/g, "''");
      query += ` AND m.searchable @@ to_tsquery('english', '${sanitizedQuery}')`;
    }

    if (sort?.field && sort?.order) {
      query += ` ORDER BY m."${sort.field}" ${sort.order}`;
    }

    query += ` LIMIT ${itemsPerPage} OFFSET ${(pageNumber - 1) * itemsPerPage}`;

    const playlistPreview = await prisma.$queryRawUnsafe(query);

    return playlistPreview;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error fetching playlist preview:", err.message);
    } else {
      console.error("Unknown error occurred:", err);
    }
    return [];
  }
}