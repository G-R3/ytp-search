import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

const API_URL = "https://www.googleapis.com/youtube/v3";

export const Route = createFileRoute("/api/playlists")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const endpoint = url.searchParams.get("endpoint");
        const params = url.searchParams.get("params");

        if (!endpoint || !process.env.YOUTUBE_API_KEY) {
          return json({ error: "Missing required params" }, { status: 400 });
        }

        const searchParams = new URLSearchParams(params!); // make this type-safe
        searchParams.set("key", process.env.YOUTUBE_API_KEY);

        const youtubeUrl = `${API_URL}/${endpoint}?${searchParams.toString()}`;

        // Get the referer from the client request, or construct it from the origin
        const referer =
          request.headers.get("referer") ||
          request.headers.get("origin") ||
          url.origin;

        const response = await fetch(youtubeUrl, {
          headers: {
            Referer: referer,
          },
        });
        const data = await response.json();

        return json(data, { status: response.status });
      },
    },
  },
});
