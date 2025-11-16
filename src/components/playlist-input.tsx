import { useState, useTransition } from "react";
import clsx from "clsx";
import type { FormEvent } from "react";
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

        if (!playlistId) return;

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
          "An error occurred while loading the playlist. Make sure your playlist is public or unlisted",
        );
        // setPlaylist(null);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Enter public or unlisted playlist URL"
          className={clsx(
            "flex-1 px-3 py-1 text-sm h-10 text-neutral-300 bg-neutral-900 rounded-lg focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-neutral-800",
          )}
          onChange={(e) => {
            if (!e.target.value.trim()) {
              setError("");
            }

            setValue(e.target.value);
          }}
          value={value}
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={isDisabled}
          className={clsx(
            "px-3 py-1 text-sm h-10 bg-neutral-900 rounded-lg text-neutral-300 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-neutral-800",
            {
              "disabled:opacity-50 disabled:cursor-not-allowed": isDisabled,
            },
          )}
        >
          Load playlist
        </button>
      </div>
      {error && (
        <span className="text-xs text-red-400 font-medium">{error}</span>
      )}
    </form>
  );
};
