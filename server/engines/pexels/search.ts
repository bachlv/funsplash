import { SearchParams } from 'types';
import { PexelsSearchParams, PexelsSearchResult } from './types';
import { request } from './utils';

const getSearchParams = (params: SearchParams): PexelsSearchParams => {
  const searchParams: PexelsSearchParams = {
    query: params.query,
    per_page: useRuntimeConfig().resultPerCall.toString(),
  };

  for (const key in params) {
    switch (key) {
      case 'page':
        searchParams.page = params.page as string;
        break;
    }
  }

  return searchParams;
};

export default async function (
  params: SearchParams
): Promise<PexelsSearchResult> {
  const searchParams = getSearchParams(params);
  const url = new URL(process.env.ENGINE_PEXELS_API_URL + '/search');
  url.search = new URLSearchParams(searchParams).toString();

  return await request(url);
}
