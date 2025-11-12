import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getPlaylist } from "@/lib/youtube";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [url, setUrl] = useState("");

  return (
    <div className="min-h-screen">
      <div className="flex gap-2">
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
            const data = await getPlaylist(url);

            console.log(data);
          }}
        >
          Load
        </button>
      </div>
    </div>
  );
}
