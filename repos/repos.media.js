import { prismaConnection as prisma } from "../connection.js";

export async function fetchMediaItems() {
  try {
    return await prisma.media.findMany();
  } catch (err) {
    // console.error("Error fetching media items:", err);
    return [];
  }
}

export async function fetchMediaItemById(mediaId) {
  try {
    const media = await prisma.media.findUnique({ where: { mediaId } });
    return media;
  } catch (err) {
    // console.error("Error fetching media item by ID:", err);
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
    const conditions = [];

    if (tags?.include) {
      conditions.push({
        tags: {
          contains: tags.include,
        },
      });
    }

    if (tags?.exclude) {
      conditions.push({
        NOT: {
          tags: {
            contains: tags.exclude,
          },
        },
      });
    }

    if (customParameters?.include) {
      Object.entries(customParameters.include).forEach(([key, value]) => {
        conditions.push({
          customParameters: {
            path: [key],
            equals: value,
          },
        });
      });
    }

    if (customParameters?.exclude) {
      Object.entries(customParameters.exclude).forEach(([key, value]) => {
        conditions.push({
          NOT: {
            customParameters: {
              path: [key],
              equals: value,
            },
          },
        });
      });
    }

    const playlistPreview = await prisma.media.findMany({
      where: conditions.length > 0 ? { AND: conditions } : undefined,
      orderBy: sort?.field
        ? {
            [sort.field]: sort.order,
          }
        : undefined,
      skip: (pageNumber - 1) * itemsPerPage,
      take: itemsPerPage,
    });

    return playlistPreview;
  } catch (err) {
    // console.error("Error fetching playlist preview:", err);
    return [];
  }
}