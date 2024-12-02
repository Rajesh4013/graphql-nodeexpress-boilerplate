export function formatMedia(rawMedia) {
    if (!rawMedia) return null;

    const { title, mediaId, images, duration, publishDate: pubDate, tags, assets: sources, tracks, customParameters, } = rawMedia;

    return {
        title,
        description: title,
        kind: "Single Item",
        playlist: [
            {
                title,
                mediaid: mediaId,
                image: (images[0])?.url,
                images,
                duration,
                pubDate,
                tags,
                sources,
                tracks,
                ...(customParameters || {}),
            },
        ],
    };
}