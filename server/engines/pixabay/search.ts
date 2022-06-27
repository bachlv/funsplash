import { SearchParams } from 'server/types';
import { PixabaySearchParams, PixabaySearchResult } from './types';

const transformSearchParams = (params: SearchParams): PixabaySearchParams => {
  const searchParams: PixabaySearchParams = {
    key: process.env.ENGINE_PIXABAY_API_KEY,
    q: params.query,
  };
  return searchParams;
};

export default async function (
  params: SearchParams
): Promise<PixabaySearchResult> {
  const searchParams = transformSearchParams(params);
  const url = new URL(process.env.ENGINE_PIXABAY_API_URL + '/');
  url.search = new URLSearchParams(searchParams).toString();

  const search = await fetch(url);

  if (!search.ok) throw new Error('Pixabay API Error: ' + search.status);
  return search.json();
}
