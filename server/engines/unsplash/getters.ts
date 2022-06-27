import { SearchResultImage } from '~~/server/types';
import { UnsplashImage } from './types';

export const getImage = (photo: UnsplashImage): SearchResultImage => ({
  id: 'un-' + photo.id,
  width: photo.width,
  height: photo.height,
  description: photo.alt_description,
  blurhash: photo.blur_hash,
  src: {
    original: photo.urls.raw,
    regular: photo.urls.regular,
    small: photo.urls.small,
    thumb: photo.urls.thumb,
  },
  photographer: photo.user.name,
  link: photo.links.html,
});
