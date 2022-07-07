export type SearchParams = {
  query: string;
  page?: string | number;
  color?: string;
};

export type SearchResult = {
  total?: number;
  results: FunsplashImage[] | any;
};

export type FunsplashImage = {
  id: string;
  width: number;
  height: number;
  description: string;
  blurhash?: string;
  src: FunsplashImageUrl;
  photographer: string;
  provider: string;
  link: string;
};

export type FunsplashImageUrl = {
  original: string;
  regular: string;
  small?: string;
  thumb: string;
};

export type ApiErrorMessage = {
  error: string;
};

export type ApiAutocomplete = {
  autocomplete: Array<{
    query: string;
  }>;
};
