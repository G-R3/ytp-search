import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useTransition } from "react";
import clsx from "clsx";
import type { Playlist } from "@/types/youtube";
import { getPlaylist } from "@/lib/youtube";
import { SearchInput } from "@/components/search-input";

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
      <div>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Enter public or unlisted playlist URL"
            className={clsx(
              "flex-1 px-3 py-1 text-sm h-10 text-neutral-300 bg-neutral-800 rounded-lg focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-neutral-800",
            )}
            onChange={(e) => {
              if (!e.target.value.trim()) {
                setError("");
              }

              setUrl(e.target.value);
            }}
            value={url}
            autoComplete="off"
          />

          <button
            disabled={isDisabled}
            className={clsx(
              "px-3 py-1 text-sm h-10 bg-neutral-800 rounded-lg text-neutral-300 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-neutral-800",
              {
                "disabled:opacity-50 disabled:cursor-not-allowed": isDisabled,
              },
            )}
            onClick={() => {
              startTransition(async () => {
                try {
                  const { meta, items } = await getPlaylist(url);
                  const itemPlaylist = {
                    name: meta.items[0].snippet.title,
                    publishedAt: meta.items[0].snippet.publishedAt,
                    description: meta.items[0].snippet.description,
                    items,
                  };

                  setPlaylist(itemPlaylist);
                  playlistRef.current = itemPlaylist;
                } catch {
                  setError(
                    "An error occurred while loading the playlist. Make sure your playlist is public or unlisted",
                  );
                  setPlaylist(null);
                }
              });
            }}
          >
            Load playlist
          </button>
        </div>
        {error && (
          <span className="text-xs text-red-400 font-medium">{error}</span>
        )}
      </div>

      {playlist && (
        <div className="flex flex-col gap-2 mt-8">
          <h2 className="text-2xl tracking-tight">{playlist.name}</h2>
          <span>{playlist.description}</span>

          {/* <span>
          {playlist.publishedAt}
          </span> */}

          <span className="text-xs text-neutral-400 text-right">
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
      )}
    </div>
  );
}
