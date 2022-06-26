import { SearchParams } from 'server/types';
import { PexelsSearchParams, PexelsSearchResult } from './types';

const transformSearchParams = (params: SearchParams): PexelsSearchParams => {
  const searchParams: PexelsSearchParams = { query: params.query };
  return searchParams;
};

export default async function (
  params: SearchParams
): Promise<PexelsSearchResult> {
  const searchParams = transformSearchParams(params);
  const url = new URL(process.env.ENGINE_PEXELS_API_URL + '/search');
  url.search = new URLSearchParams(params).toString();

  const search = await fetch(url, {
    headers: {
      Authorization: process.env.ENGINE_PEXELS_API_KEY,
    },
  });

  if (!search.ok) throw new Error('Pexels API Error: ' + search.status);
  return search.json();
}
