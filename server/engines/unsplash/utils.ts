import { FunsplashImage } from 'types';
import { UnsplashImage, UnsplashAutocomplete } from './types';

export const request = async (url: URL) => {
  const search = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${process.env.ENGINE_UNSPLASH_API_KEY}`,
      'Accept-Version': process.env.ENGINE_UNSPLASH_API_VER,
    },
  });
  if (search.ok) return search.json();
  else console.error('Unsplash API Error:', search.status, await search.text());
};

export const getImage = (photo: UnsplashImage): FunsplashImage => ({
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

export const getAutocomplete = (data: UnsplashAutocomplete) => ({
  autocomplete: data.autocomplete.map((e) => e.query),
});
