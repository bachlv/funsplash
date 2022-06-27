export type PixabaySearchParams = {
  key: string;
  q?: string;
  page?: string;
  per_page?: string;
  content_filter?: 'low' | 'high';
  safesearch?: 'true' | 'false';
  order?: 'popular' | 'latest';
  color?:
    | 'grayscale'
    | 'black'
    | 'white'
    | 'yellow'
    | 'orange'
    | 'red'
    | 'turquoise'
    | 'blue'
    | 'green'
    | 'lilac'
    | 'pink'
    | 'gray'
    | 'transparent';
  orientation?: 'all' | 'horizontal' | 'vertical';
};

export type PixabaySearchResult = {
  total: number;
  totalHits: number;
  hits: PixabayPhoto[];
};

export type PixabayPhoto = {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  collections: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
};
