export type SearchParams = {
  query?: string;
  color?: string;
  page?: string;
};

export type SearchResult = {
  total: number;
  results: SearchResultImage[] | any;
};

export type SearchResultImage = {
  id: string;
  width: number;
  height: number;
  color: string;
  description: string;
  blurhash?: string;
  src: SearchResultImageUrl;
  photographer: string;
  link: string;
};

export type SearchResultImageUrl = {
  original: string;
  regular: string;
  small: string;
  thumb: string;
};

export type ApiErrorMessage = {
  error: string;
};
