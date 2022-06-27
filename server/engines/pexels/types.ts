export type PexelsSearchParams = {
  query: string;
  page?: string;
  per_page?: string;
  color?:
    | 'black'
    | 'white'
    | 'yellow'
    | 'orange'
    | 'red'
    | 'violet'
    | 'pink'
    | 'brown'
    | 'gray';
  orientation?: 'landscape' | 'portrait' | 'square';
};

export type PexelsSearchResult = {
  page: number;
  per_page: number;
  photos: PexelsImage[];
  total_results: number;
};

export type PexelsImage = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  avg_color: string;
  src: PexelsImageUrls;
  liked: boolean;
  alt: string;
};

export type PexelsImageUrls = {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
};
