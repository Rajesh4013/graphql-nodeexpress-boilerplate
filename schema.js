import path from "path";
import {
  objectType,
  inputObjectType,
  makeSchema,
  nonNull,
  idArg,
  asNexusMethod,
} from "nexus";
import { GraphQLDateTime, GraphQLJSON } from "graphql-scalars";

export const DateTime = asNexusMethod(GraphQLDateTime, "date");
export const JSON = asNexusMethod(GraphQLJSON, "json");

const PlaylistMediaItem = objectType({
  name: "PlaylistMediaItem",
  definition(t) {
    t.nonNull.string("title");
    t.nonNull.string("mediaid");
    t.string("image");
    t.list.field("images", { type: "JSON" });
    t.nonNull.float("duration");
    t.nonNull.field("pubDate", { type: "DateTime" });
    t.string("tags");
    t.list.field("sources", { type: "JSON" });
    t.list.field("tracks", { type: "JSON" });
  },
});

const Media = objectType({
  name: "Media",
  definition(t) {
    t.nonNull.string("title");
    t.string("description");
    t.string("kind");
    t.list.field("playlist", { type: PlaylistMediaItem });
  },
});

const PlaylistMetadata = inputObjectType({
  name: "PlaylistMetadata",
  definition(t) {
    t.string("title");
    t.string("description");
    t.string("type");
    t.field("customParameters", { type: "JSON" });
  },
});

const DynamicPlaylistConfig = inputObjectType({
  name: "DynamicPlaylistConfig",
  definition(t) {
    t.field("tags", {
      type: inputObjectType({
        name: "Tags",
        definition(t) {
          t.nullable.list.field("include", { type: "String" });
          t.nullable.list.field("exclude", { type: "String" });
        },
      }),
    });
    t.field("customParameters", {
      type: inputObjectType({
        name: "CustomParameters",
        definition(t) {
          t.nullable.field("include", { type: "JSON" });
          t.nullable.field("exclude", { type: "JSON" });
        },
      }),
    });
    t.field("sort", {
      type: inputObjectType({
        name: "Sort",
        definition(t) {
          t.string("field");
          t.string("order");
        },
      }),
    });
    t.int("itemsPerPage");
    t.int("pageNumber");
  },
});

const Playlist = objectType({
  name: "Playlist",
  definition(t) {
    t.nonNull.string("feedId");
    t.nonNull.string("title");
    t.string("description");
    t.list.field("playlist", { type: Media });
    t.field("customParameters", {
      type: "JSON",
      resolve(parent) {
        const { feedid, title, description, playlist, ...customParameters } =
          parent;
        return custom_parameters;
      },
    });
  },
});

const Query = objectType({
  name: "Query",
  definition(t) {
    t.field("media", {
      type: "JSON",
      args: { id: nonNull(idArg()) },
      resolve: async (_parent, { id }, ctx) => {
        return ctx.getMedia(id);
      },
    });
    t.field("getPlaylistById", {
      type: "JSON",
      args: { playlistId: nonNull(idArg()) },
      resolve: async (_parent, { playlistId }, ctx) => {
        const playlist = await ctx.getPlaylistById(playlistId);
        if (!playlist) {
          throw new Error(`Playlist with ID ${playlistId} not found.`);
        }
        return playlist;
      },
    });
  },
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("createPlaylist", {
      type: "JSON",
      args: {
        playlistMetadata: nonNull(PlaylistMetadata),
        dynamicPlaylistConfig: nonNull(DynamicPlaylistConfig),
      },
      resolve: async (
        _parent,
        { playlistMetadata, dynamicPlaylistConfig },
        ctx
      ) => {
        return ctx.createPlaylist(playlistMetadata, dynamicPlaylistConfig);
      },
    });
    t.field("updatePlaylist", {
      type: "JSON",
      args: {
        playlistId: nonNull(idArg()),
        playlistMetadata: PlaylistMetadata,
        dynamicPlaylistConfig: DynamicPlaylistConfig,
      },
      resolve: async (
        _parent,
        { playlistId, playlistMetadata, dynamicPlaylistConfig },
        ctx
      ) => {
        return ctx.updatePlaylist(
          playlistId,
          playlistMetadata,
          dynamicPlaylistConfig
        );
      },
    });
  },
});

export const schema = makeSchema({
  types: [
    DateTime,
    JSON,
    Query,
    Mutation,
    Media,
    Playlist,
    PlaylistMediaItem,
    PlaylistMetadata,
    DynamicPlaylistConfig,
  ],
});

export {
  Media,
  PlaylistMediaItem,
  PlaylistMetadata,
  DynamicPlaylistConfig,
  Mutation,
};