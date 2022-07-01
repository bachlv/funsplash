import { SearchParams } from 'types';
import { UnsplashSearchParams, UnsplashSearchResult } from './types';
import { request } from './utils';

const getSearchParams = (params: SearchParams): UnsplashSearchParams => {
  const searchParams: UnsplashSearchParams = { query: params.query };
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
): Promise<UnsplashSearchResult> {
  const searchParams = getSearchParams(params);
  const url = new URL(process.env.ENGINE_UNSPLASH_API_URL + '/search/photos');
  url.search = new URLSearchParams(searchParams).toString();
  return request(url);
}
