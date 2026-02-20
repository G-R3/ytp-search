import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Calendar,
  ExternalLink,
  LayoutGrid,
  Play,
  Youtube,
} from "lucide-react";
import type { Playlist } from "@/types/youtube";
import { SearchInput } from "@/components/search-input";
import { PlaylistInput } from "@/components/playlist-input";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [search, setSearch] = useState("");
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const playlistRef = useRef<Playlist | null>(null);

  const handleSearch = (query: string) => {
    if (!playlist || !playlistRef.current) return;

    setSearch(query);

    if (!query.trim().length) {
      setPlaylist(playlistRef.current);
      return;
    }

    const lowerSearch = query.toLowerCase();

    const filtered = playlistRef.current.items.filter((item) => {
      const titleMatch = item.snippet.title
        ? item.snippet.title.toLowerCase().includes(lowerSearch)
        : false;
      const descriptionMatch = item.snippet.description
        ? item.snippet.description.toLowerCase().includes(lowerSearch)
        : false;
      const channelMatch = item.snippet.videoOwnerChannelTitle
        ? item.snippet.videoOwnerChannelTitle
            .toLowerCase()
            .includes(lowerSearch)
        : false;

      return titleMatch || channelMatch || descriptionMatch;
    });

    setPlaylist({
      ...playlistRef.current,
      items: filtered,
    });
  };

  return (
    <div className="min-h-screen text-neutral-200 selection:bg-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <header className="flex flex-col items-center justify-center mb-16 space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-neutral-900/50 rounded-2xl border border-neutral-800 shadow-xl ring-1 ring-white/5">
              <Youtube size={32} className="text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center bg-linear-to-b from-white to-neutral-500 bg-clip-text text-transparent">
              YouTube Playlist Search
            </h1>
            <p className="text-neutral-400 text-center max-w-lg text-lg">
              Search and filter your favorite playlists.
            </p>
          </div>

          <PlaylistInput
            onSubmit={(playlistItems: Playlist) => {
              setPlaylist(playlistItems);
              playlistRef.current = playlistItems;
            }}
          />
        </header>

        {playlist ? (
          <main className="space-y-8 animate-slide-in-up ">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between bg-neutral-900/30 p-6 rounded-2xl border border-neutral-800/50">
              <div className="space-y-2 flex-1">
                <h2 className="text-2xl font-semibold text-white tracking-tight">
                  {playlist.name}
                </h2>
                <p className="text-neutral-400 leading-relaxed max-w-2xl line-clamp-2">
                  {playlist.description || "No description available."}
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-neutral-500 pt-2">
                  <div className="flex items-center gap-1.5">
                    <LayoutGrid size={14} />
                    <span>{playlist.items.length} videos</span>
                  </div>
                  {playlist.publishedAt && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>
                        {new Date(playlist.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full md:w-72 shrink-0">
                <SearchInput onSearch={handleSearch} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {playlist.items.map((item) => {
                const thumbnailUrl =
                  item.snippet.thumbnails.high?.url ||
                  item.snippet.thumbnails.medium?.url ||
                  item.snippet.thumbnails.default?.url;

                return (
                  <a
                    key={item.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://youtube.com/watch?v=${item.snippet.resourceId.videoId}`}
                    className="group flex flex-col bg-neutral-900/40 border border-neutral-800/50 rounded-xl overflow-hidden hover:border-neutral-700 hover:bg-neutral-900/60 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={item.snippet.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-700">
                          <Youtube size={32} />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg ring-1 ring-white/20 scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Play size={20} fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1 gap-3">
                      <h3
                        title={item.snippet.title}
                        className="font-medium text-neutral-200 line-clamp-2 leading-snug group-hover:text-white transition-colors"
                      >
                        {item.snippet.title}
                      </h3>

                      <div className="mt-auto flex items-center justify-between text-xs text-neutral-500">
                        <div className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors">
                          <span className="truncate max-w-[120px]">
                            {item.snippet.videoOwnerChannelTitle}
                          </span>
                        </div>
                        <ExternalLink
                          size={12}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {playlist.items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                <p>No videos found matching your search.</p>
              </div>
            )}
          </main>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-fade-in duration-1000 delay-200">
            <div className="w-16 h-1 bg-neutral-800 rounded-full opacity-50" />
            <p className="text-neutral-500 font-medium text-sm uppercase tracking-wider">
              Ready to Search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
