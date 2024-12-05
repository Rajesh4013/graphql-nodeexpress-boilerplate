import { prismaConnection as prisma } from "../connection.js";

export async function fetchMediaItems() {
  try {
    return await prisma.$queryRaw`SELECT * FROM "Media" m;`;
  } catch (err) {
    console.error("Error fetching media items:", err);
    return [];
  }
}

export async function fetchMediaItemById(media_id) {
  try {
    const media = await prisma.$queryRaw`SELECT * FROM "Media" m WHERE m."media_id" = ${media_id}`;
    return media[0];
  } catch (err) {
    console.error("Error fetching media item by ID:", err);
    return null;
  }
}

export async function fetchDynamicMediaItems(playlistConfig) {
  const {
    tags,
    custom_parameters,
    page_number,
    items_per_page,
    sort,
  } = playlistConfig;
  const customParameters = custom_parameters;
  let itemsPerPage = items_per_page;
  let pageNumber = page_number;
  if (pageNumber == undefined) {
    pageNumber = 1;
  }
  if (itemsPerPage == undefined) {
    itemsPerPage = 500;
  }
  console.log(playlistConfig, itemsPerPage, pageNumber);
  // itemsPerPage = playlistConfig.itemsPerPage? playlistConfig.itemsPerPage : itemsPerPage;

  try {
    let query = `SELECT * FROM "Media" m WHERE 1=1`;

    if (tags?.include) {
      query += ` AND m."tags" @> ARRAY['${tags.include}']::text[]`;
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
        query += ` AND m."custom_parameters" NOT @> '{"${key}": "${value}"}'`;
      });
    }

    if (sort?.field && sort?.order) {
      query += ` ORDER BY m."${sort.field}" ${sort.order}`;
    }

    query += ` LIMIT ${itemsPerPage} OFFSET ${(pageNumber - 1) * itemsPerPage}`;

    console.log(query);
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