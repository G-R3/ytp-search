import { useState, useTransition } from "react";
import clsx from "clsx";
import type { FormEvent } from "react";
import { Link, Loader2, ArrowRight } from "lucide-react";
import type { Playlist } from "@/types/youtube";
import { extractYoutubeId, getPlaylist } from "@/lib/youtube";

type PlaylistInputProps = {
  onSubmit: (playlist: Playlist) => void;
};

export const PlaylistInput = ({ onSubmit }: PlaylistInputProps) => {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const isDisabled = isPending || !value.trim().length;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isDisabled) return;

    setError("");
    startTransition(async () => {
      try {
        const playlistId = extractYoutubeId(value);

        if (!playlistId) {
          setError("Invalid YouTube playlist URL");
          return;
        }

        const { meta, items } = await getPlaylist(playlistId);
        const itemPlaylist = {
          name: meta.items[0].snippet.title,
          publishedAt: meta.items[0].snippet.publishedAt,
          description: meta.items[0].snippet.description,
          items,
        };

        onSubmit(itemPlaylist);
      } catch {
        setError(
          "Could not load playlist. Please ensure it is public or unlisted.",
        );
      }
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-neutral-500 pointer-events-none transition-colors group-focus-within:text-neutral-300">
            <Link size={16} />
          </div>
          
          <input
            type="url"
            placeholder="Paste YouTube playlist URL..."
            className={clsx(
              "w-full pl-10 pr-32 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl",
              "text-sm text-neutral-200 placeholder:text-neutral-600",
              "focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600",
              "transition-all duration-200 ease-in-out",
              "hover:border-neutral-700"
            )}
            onChange={(e) => {
              if (!e.target.value.trim()) setError("");
              setValue(e.target.value);
            }}
            value={value}
            autoComplete="off"
          />

          <div className="absolute right-1.5 top-1.5 bottom-1.5">
            <button
              type="submit"
              disabled={isDisabled}
              className={clsx(
                "h-full px-4 flex items-center gap-2 rounded-lg text-xs font-medium transition-all duration-200",
                isDisabled
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  : "bg-white text-black hover:bg-neutral-200 active:scale-95"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Loading</span>
                </>
              ) : (
                <>
                  <span>Load</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      
      <div className={clsx(
        "mt-2 text-center transition-all duration-300 overflow-hidden",
        error ? "opacity-100 max-h-10" : "opacity-0 max-h-0"
      )}>
        <span className="text-xs text-red-400 font-medium bg-red-400/10 px-3 py-1 rounded-full">
          {error}
        </span>
      </div>
    </div>
  );
};
