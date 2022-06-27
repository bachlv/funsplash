export type UnsplashSearchParams = {
  query: string;
  page?: string;
  per_page?: string;
  content_filter?: 'low' | 'high';
  color?:
    | 'black_and_white'
    | 'black'
    | 'white'
    | 'yellow'
    | 'orange'
    | 'red'
    | 'purple'
    | 'magenta'
    | 'green'
    | 'teal'
    | 'blue';
  orientation?: 'landscape' | 'portrait' | 'squarish';
};

export type UnsplashSearchResult = {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
};

export type UnsplashImage = {
  id: string;
  created_at: string;
  updated_at: string;
  promoted_at?: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description?: string;
  alt_description?: string;
  urls: UnsplashImageUrls;
  links: UnsplashLinks;
  user: UnsplashUser;
};

export type UnsplashImageUrls = {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
};

export type UnsplashLinks = {
  self: string;
  html: string;
  download: string;
  download_location: string;
};

export type UnsplashUser = {
  username: string;
  name: string;
};
