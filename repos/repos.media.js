import { prismaConnection as prisma } from "../connection.js";

export async function fetchMediaItems() {
  try {
    return await prisma.$queryRaw`SELECT * FROM "Media" m;`;
  } catch (err) {
    console.error("Error fetching media items:", err);
    return [];
  }
}

export async function fetchMediaItemById(mediaId) {
  try {
    const media: any = await prisma.$queryRaw`SELECT * FROM "Media" m WHERE m."mediaId" = ${mediaId}`;
    return media? media[0]: null;
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

  try {
    let query = `SELECT * FROM "Media" m WHERE 1=1`;

    if (tags?.include) {
      query += ` AND m."tags" ILIKE '%${tags.include}%'`;
    }

    if (tags?.exclude) {
      query += ` AND m."tags" NOT ILIKE '%${tags.exclude}%'`;
    }

    if (customParameters?.include) {
      Object.entries(customParameters.include).forEach(([key, value]) => {
        query += ` AND m."customParameters" @> '{"${key}": "${value}"}'`;
      });
    }

    if (customParameters?.exclude) {
      Object.entries(customParameters.exclude).forEach(([key, value]) => {
        query += ` AND m."customParameters" NOT @> '{"${key}": "${value}"}'`;
      });
    }

    if (sort?.field && sort?.order) {
      query += ` ORDER BY m."${sort.field}" ${sort.order}`;
    }

    query += ` LIMIT ${itemsPerPage} OFFSET ${(pageNumber - 1) * itemsPerPage}`;

    console.log(query);
    const playlistPreview = await prisma.$queryRawUnsafe(query);

    return playlistPreview;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error fetching playlist preview:", err.message);
    } else {
      console.error("Unknown error occurred:", err);
    }
    return [];
  }
}