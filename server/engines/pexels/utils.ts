import { FunsplashImage } from 'types';
import { PexelsImage } from './types';
import { getBlurhash } from '../utils';

export const request = async (url: URL) => {
  const search = await fetch(url, {
    headers: {
      Authorization: process.env.ENGINE_PEXELS_API_KEY,
    },
  });

  if (search.ok) return search.json();
  else console.error('Pexels API Error:', search.status, await search.text());
};

export const getImage = async (
  photo: PexelsImage
): Promise<FunsplashImage> => ({
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
