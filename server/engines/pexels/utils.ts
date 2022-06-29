import { SearchParams, SearchResultImage } from '~/server/types';
import { PexelsImage } from './types';
import { getBlurhash } from '../utils';

export const getImage = async (
  photo: PexelsImage
): Promise<SearchResultImage> => ({
  id: 'pe-' + photo.id,
  width: photo.width,
  height: photo.height,
  description: photo.alt,
  src: {
    original: photo.src.original,
    regular: photo.src.large2x,
    small: photo.src.large,
    thumb: photo.src.tiny,
  },
  photographer: photo.photographer,
  provider: 'pexels',
  link: photo.url,
});
