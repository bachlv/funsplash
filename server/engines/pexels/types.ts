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
  photos: PexelsPhoto[];
  total_results: number;
};

export type PexelsPhoto = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  avg_color: string;
  src: PexelsPhotoUrls;
  liked: boolean;
  alt: string;
};

export type PexelsPhotoUrls = {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
};
