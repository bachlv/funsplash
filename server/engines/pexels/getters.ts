import { SearchResultPhoto } from '~~/server/types';
import { PexelsPhoto } from './types';

export const getPhoto = (photo: PexelsPhoto): SearchResultPhoto => ({
  id: 'pe-' + photo.id,
  width: photo.width,
  height: photo.height,
  color: photo.avg_color,
  description: photo.alt,
  src: {
    original: photo.src.original,
    regular: photo.src.large,
    small: photo.src.small,
    thumb: photo.src.tiny,
  },
  photographer: photo.photographer,
  link: photo.url,
});
