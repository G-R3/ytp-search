import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getPlaylist } from "@/lib/youtube";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [url, setUrl] = useState("");
  const [playlist, setPlaylist] = useState<any>(null);

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
        />

        <button
          className="border"
          onClick={async () => {
            const { meta, items } = await getPlaylist(url);
            console.log(meta, items);
            const playlist = {
              name: meta.items[0].snippet.title,
              publishedAt: meta.items[0].snippet.publishedAt,
              description: meta.items[0].snippet.description,
              items: items.items.map((item: any) => ({
                id: item.id,
                position: item.snippet.position,
                publishedAt: item.snippet.publishedAt,
                title: item.snippet.title,
                description: item.snippet.description,
                videoOwnerChannelTitle: item.snippet.videoOwnerChannelTitle,
                videoId: item.snippet.resourceId.videoId,
                thumbnail: item.snippet.thumbnails.default,
              })),
            };

            setPlaylist(playlist);
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
              return (
                <div
                  key={item.id}
                  className="border rounded-md overflow-hidden"
                >
                  <img
                    src={item.thumbnail.url}
                    width={item.thumbnail.width}
                    height={item.thumbnail.height}
                    alt={item.title}
                  />
                  <p>{item.title}</p>
                  <p>by {item.videoOwnerChannelTitle}</p>
                  <p className="line-clamp-3">{item.description}</p>
                  <span>{item.publishedAt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
