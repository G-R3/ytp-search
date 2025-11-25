import type { Item } from "@/types/youtube";

const API_URL = "/api/playlists/";

const getPlaylistMeta = async (playlistId: string) => {
  const params = new URLSearchParams({
    part: "snippet",
    id: playlistId,
  });

  const response = await fetch(
    `${API_URL}?endpoint=playlists&params=${encodeURIComponent(params.toString())}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playlist metadata");
  }

  return response.json();
};

const getPlaylistItems = async (playlistId: string) => {
  let nextPageToken: string | undefined = undefined;
  const allItems: Array<Item> = [];

  do {
    const params = new URLSearchParams({
      part: "snippet",
      playlistId: playlistId,
      maxResults: "50",
    });

    if (nextPageToken) {
      params.set("pageToken", nextPageToken);
    }

    const response = await fetch(
      `${API_URL}?endpoint=playlistItems&params=${encodeURIComponent(params.toString())}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch playlist items");
    }

    const data = await response.json();

    if (!data.items.length) break;

    // TODO: filter out deleted videos
    const items = (data.items as Array<Item>).map((item) => ({
      id: item.id,
      etag: item.etag,
      kind: item.kind,
      snippet: {
        position: item.snippet.position,
        publishedAt: item.snippet.publishedAt,
        title: item.snippet.title,
        description: item.snippet.description,
        videoOwnerChannelTitle: item.snippet.videoOwnerChannelTitle,
        resourceId: {
          kind: item.snippet.resourceId.kind,
          videoId: item.snippet.resourceId.videoId,
        },
        thumbnails: item.snippet.thumbnails,
      },
    }));

    nextPageToken = data.nextPageToken;

    allItems.push(...items);
  } while (nextPageToken);

  // const seenVideoIds = new Set();
  // const uniqueVideos = allItems.filter((item) => {
  //   if (seenVideoIds.has(item.snippet.resourceId.videoId)) {
  //     return false;
  //   }

  //   seenVideoIds.add(item.snippet.resourceId.videoId);
  //   return true;
  // });

  return allItems;
};

export async function getPlaylist(playlistId: string) {
  const [meta, items] = await Promise.all([
    getPlaylistMeta(playlistId),
    getPlaylistItems(playlistId),
  ]);

  return { meta, items };
}

export const extractYoutubeId = (input: string) => {
  const trimmed = input.trim();

  if (!trimmed.includes("youtube.com") && !trimmed.includes("youtu.be")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const listParam = url.searchParams.get("list");

    if (listParam) {
      return listParam;
    }
  } catch {
    return trimmed;
  }

  return null;
};
