import { getMedia } from "./resolvers/resolvers.media.js";
import {
  createPlaylist,
  updatePlaylist,
  getPlaylistById,
} from "./resolvers/resolvers.playlist.js";

export const createContext = () => {
  return {
    getMedia,
    createPlaylist,
    updatePlaylist,
    getPlaylistById,
  };
};