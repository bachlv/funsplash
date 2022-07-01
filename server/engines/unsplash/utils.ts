import { SearchResultImage } from 'types';
import { UnsplashImage } from './types';

export const request = async (url: URL) => {
  const search = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${process.env.ENGINE_UNSPLASH_API_KEY}`,
      'Accept-Version': process.env.ENGINE_UNSPLASH_API_VER,
    },
  });

  if (!search.ok)
    throw new Error(
      'Unsplash API Error: ' + search.status + (await search.text())
    );
  return search.json();
};

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
  provider: 'unsplash',
  link: photo.links.html,
});
