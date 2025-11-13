import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Playlist } from "@/types/youtube";
import { getPlaylist } from "@/lib/youtube";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [url, setUrl] = useState("");
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  console.log("playlist", playlist);
  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-2">
        <input
          type="url"
          placeholder="Enter public or unlisted playlist URL"
          className="border"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          autoComplete="off"
        />

        <button
          className="border"
          onClick={async () => {
            console.log("URL", url);
            const { meta, items } = await getPlaylist(url);
            console.log(meta, items);
            const itemPlaylist = {
              name: meta.items[0].snippet.title,
              publishedAt: meta.items[0].snippet.publishedAt,
              description: meta.items[0].snippet.description,
              items,
            };

            setPlaylist(itemPlaylist);
          }}
        >
          Load
        </button>
      </div>
      {playlist && (
        <div className="flex flex-col gap-2">
          <h2>{playlist.name}</h2>
          <span>
            {playlist.description} - {playlist.publishedAt}
          </span>

          <div className="grid grid-cols-4 gap-4">
            {playlist.items.map((item) => {
              console.log("RENDERING ITEM", item);
              return (
                <div
                  key={item.id}
                  className="border rounded-md overflow-hidden"
                >
                  {item.snippet.thumbnails.default?.url ? (
                    <img
                      src={item.snippet.thumbnails.default.url}
                      width={item.snippet.thumbnails.default.width}
                      height={item.snippet.thumbnails.default.height}
                      alt={item.snippet.title}
                    />
                  ) : (
                    <div>No Thumbnail found</div>
                  )}
                  <p>{item.snippet.title}</p>
                  <p>by {item.snippet.videoOwnerChannelTitle}</p>
                  <p className="line-clamp-3">{item.snippet.description}</p>
                  <span>{item.snippet.publishedAt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
