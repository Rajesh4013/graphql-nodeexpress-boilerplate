import { fetchMediaItemById } from '../repos/repos.media.js';
import { formatMedia } from '../utils/utils.media.js';

export async function getMedia(mediaId) {
  return formatMedia(await fetchMediaItemById(mediaId));
}
