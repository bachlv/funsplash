import { SearchResultPhoto } from '~~/server/types';
import { UnsplashPhoto } from './types';

export const getPhoto = (photo: UnsplashPhoto): SearchResultPhoto => ({
  id: 'un-' + photo.id,
  width: photo.width,
  height: photo.height,
  color: photo.color,
  description: photo.alt_description,
  src: {
    original: photo.urls.raw,
    regular: photo.urls.regular,
    small: photo.urls.small,
    thumb: photo.urls.thumb,
  },
  photographer: photo.user.name,
  link: photo.links.html,
});
