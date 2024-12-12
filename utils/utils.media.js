export function formatMedia(rawMedia) {
  if (!rawMedia) return null;

  const {
    title,
    media_id,
    duration,
    publish_date,
    tags,
    custom_parameters,
    media_type,
  } = rawMedia;
  return {
    title,
    description: title,
    kind: media_type,
    playlist: [
      {
        title,
        media_id,
        duration,
        publish_date,
        tags,
        ...(custom_parameters || {}),
      },
    ],
  };
}
