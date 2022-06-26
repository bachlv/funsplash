export type SearchParams = {
  query?: string;
  color?: string;
  page?: string;
};

export type SearchResult = {
  total: number;
  results: SearchResultPhoto[] | any;
};

export type SearchResultPhoto = {
  id: string;
  width: number;
  height: number;
  color: string;
  description: string;
  src: SearchResultPhotoUrl;
  photographer: string;
  link: string;
};

export type SearchResultPhotoUrl = {
  original: string;
  regular: string;
  small: string;
  thumb: string;
};

export type ErrorMessage = {
  error: string;
};
