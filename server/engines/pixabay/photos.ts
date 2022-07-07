import { PixabaySearchResult } from './types';
import { request } from './utils';

export default async function (id: string): Promise<PixabaySearchResult> {
  const url = new URL(process.env.ENGINE_PIXABAY_API_URL + '/');
  url.search = new URLSearchParams({
    id: id,
    key: process.env.ENGINE_PIXABAY_API_KEY,
  }).toString();
  return request(url);
}
