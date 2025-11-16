import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useTransition } from "react";
import clsx from "clsx";
import type { Playlist } from "@/types/youtube";
import { extractYoutubeId, getPlaylist } from "@/lib/youtube";
import { SearchInput } from "@/components/search-input";
import { PlaylistInput } from "@/components/playlist-input";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [url, setUrl] = useState("PLEjXiMSBSC2D2OTbGejKTEB7htFbkaEqZ");
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [error, setError] = useState("");
  const playlistRef = useRef<Playlist | null>(null);

  const isDisabled = isPending || !url.trim().length;

  const handleSearch = (query: string) => {
    if (!playlist || !playlistRef.current) return;

    setSearch(query);

    if (!query.trim().length) {
      setPlaylist(playlistRef.current);
      return;
    }

    const lowerSearch = search.toLowerCase();

    const filtered = playlistRef.current.items.filter((item) => {
      if (
        item.snippet.title === "Deleted video" ||
        item.snippet.title === "Private video"
      )
        return;

      const titleMatch = item.snippet.title.toLowerCase().includes(lowerSearch);
      const descriptionMatch = item.snippet.description
        .toLowerCase()
        .includes(lowerSearch);
      const channelMatch = item.snippet.videoOwnerChannelTitle
        .toLowerCase()
        .includes(lowerSearch);

      return titleMatch || descriptionMatch || channelMatch;
    });

    setPlaylist({
      ...playlistRef.current,
      items: filtered,
    });
  };

  return (
    <div className="min-h-screen p-8">
      <PlaylistInput
        onSubmit={(playlistItems: Playlist) => {
          setPlaylist(playlistItems);
          playlistRef.current = playlistItems;
        }}
      />

      {playlist ? (
        <div className="flex flex-col gap-2 mt-8">
          <h2 className="text-2xl tracking-tight">{playlist.name}</h2>
          <span className="text-sm tracking-wide text-neutral-400">
            {playlist.description}
          </span>

          {/* <span>
          {playlist.publishedAt}
          </span> */}

          <span className="text-xs text-neutral-500 text-right">
            {playlist.items.length} videos
          </span>

          <SearchInput onSearch={handleSearch} />

          <div className="grid grid-cols-4 gap-4 mt-4">
            {playlist.items.map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex flex-col border border-neutral-800 rounded-md overflow-hidden h-72"
                >
                  {item.snippet.thumbnails.high?.url ? (
                    <img
                      src={item.snippet.thumbnails.high.url}
                      width={item.snippet.thumbnails.high.width}
                      height={item.snippet.thumbnails.high.height}
                      alt={item.snippet.title}
                    />
                  ) : (
                    <div>No Thumbnail found</div>
                  )}
                  <div className="px-2 py-1 flex-1 flex flex-col">
                    <p>{item.snippet.title}</p>
                    <p className="mt-auto text-sm text-neutral-300">
                      by
                      <span> {item.snippet.videoOwnerChannelTitle}</span>
                    </p>
                    {/* <p className="line-clamp-3">{item.snippet.description}</p> */}
                    {/* <span>{item.snippet.publishedAt}</span> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 mt-40">
          <p className="text-neutral-400">Load a playlist to start searching</p>
        </div>
      )}
    </div>
  );
}
