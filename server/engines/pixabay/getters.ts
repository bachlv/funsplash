import { SearchResultPhoto } from '~~/server/types';
import { PixabayPhoto } from './types';

const getDirectLink = (previewURL: string): string =>
  process.env.ENGINE_PIXABAY_DL_URL +
  '/' +
  previewURL.split('/').slice(-1)[0].replace('_150', '') +
  '?attachment';

export const getPhoto = (photo: PixabayPhoto): SearchResultPhoto => ({
  id: 'pi-' + photo.id,
  width: photo.imageWidth,
  height: photo.imageHeight,
  color: 'NOCOLOR',
  description: photo.tags,
  src: {
    original: getDirectLink(photo.previewURL),
    regular: photo.largeImageURL,
    small: photo.webformatURL,
    thumb: photo.previewURL,
  },
  photographer: photo.user,
  link: photo.pageURL,
});
