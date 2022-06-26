import { SearchParams } from 'server/types';
import { UnsplashSearchParams, UnsplashSearchResult } from './types';

const transformSearchParams = (params: SearchParams): UnsplashSearchParams => {
  const searchParams: UnsplashSearchParams = { query: params.query };
  return searchParams;
};

export default async function (
  params: SearchParams
): Promise<UnsplashSearchResult> {
  const searchParams = transformSearchParams(params);
  const url = new URL(process.env.ENGINE_UNSPLASH_API_URL + '/search/photos');
  url.search = new URLSearchParams(params).toString();

  const search = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${process.env.ENGINE_UNSPLASH_API_KEY}`,
      'Accept-Version': process.env.ENGINE_UNSPLASH_API_VER,
    },
  });

  if (!search.ok) throw new Error('Unsplash API Error: ' + search.status);
  return search.json();
}
