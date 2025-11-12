const API_URL = "/api/playlists/";

const getPlaylistMeta = async (playlistId: string) => {
  const params = new URLSearchParams({
    part: "snippet",
    id: playlistId,
  });

  console.log("HEREE");

  const response = await fetch(
    `${API_URL}?endpoint=playlists&params=${encodeURIComponent(params.toString())}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playlist metadata");
  }

  return response.json();
};

const getPlaylistItems = async (playlistId: string) => {
  const params = new URLSearchParams({
    part: "snippet",
    playlistId: playlistId,
    maxResults: "50",
  });

  const response = await fetch(
    `${API_URL}?endpoint=playlistItems&params=${encodeURIComponent(params.toString())}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playlist items");
  }

  return response.json();
};

export async function getPlaylist(playlistId: string) {
  console.log("testtetes");
  const [meta, items] = await Promise.all([
    getPlaylistMeta(playlistId),
    getPlaylistItems(playlistId),
  ]);

  return { meta, items };
}
