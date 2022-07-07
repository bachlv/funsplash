import { FunsplashImage } from 'types';
import { getBlurhash } from '../utils';
import { PixabayImage } from './types';

export const request = async (url: URL) => {
  const search = await fetch(url);
  if (search.ok) return search.json();
  else console.error('Pexels API Error:', search.status, await search.text());
};

const getDirectLink = (previewURL: string): string =>
  process.env.ENGINE_PIXABAY_DL_URL +
  '/' +
  previewURL.split('/').slice(-1)[0].replace('_150', '') +
  '?attachment';

export const getImage = async (
  photo: PixabayImage
): Promise<FunsplashImage> => ({
  id: 'pi-' + photo.id,
  width: photo.imageWidth,
  height: photo.imageHeight,
  description: photo.tags,
  src: {
    original: getDirectLink(photo.previewURL),
    regular: photo.largeImageURL,
    small: photo.webformatURL,
    thumb: photo.previewURL,
  },
  photographer: photo.user,
  provider: 'pixabay',
  link: photo.pageURL,
});
