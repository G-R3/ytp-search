export type Item = {
  id: string;
  etag: string;
  kind: string;
  snippet: {
    position: number;
    publishedAt: string;
    title: string;
    description: string;
    videoOwnerChannelTitle: string;
    resourceId: {
      kind: string;
      videoId: string;
    };
    thumbnails: {
      default?: {
        url: string;
        width: string;
        height: string;
      };
    };
  };
};

export type ItemsResponse = {
  items: Array<Item>;
  nextPageToken: string;
  pageInfo: {
    resultsPerPage: number;
    totalResults: number;
  };
};

export type Playlist = {
  name: string;
  publishedAt: string;
  description: string;
  items: Array<Item>;
};
