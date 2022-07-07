import { SearchParams } from 'types';
import { PixabaySearchParams, PixabaySearchResult } from './types';
import { request } from './utils';

const getSearchParams = (params: SearchParams): PixabaySearchParams => {
  const searchParams: PixabaySearchParams = {
    key: process.env.ENGINE_PIXABAY_API_KEY,
    q: params.query,
    per_page: useRuntimeConfig().resultPerCall.toString(),
    image_type: 'photo',
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
): Promise<PixabaySearchResult> {
  const searchParams = getSearchParams(params);
  const url = new URL(process.env.ENGINE_PIXABAY_API_URL + '/');
  url.search = new URLSearchParams(searchParams).toString();

  return await request(url);
}
