import { request } from './utils';

const AUTOCOMPLETE_API = process.env.ENGINE_UNSPLASH_SUGGESTION_API + '/';

export default async function (keyword: string) {
  const url = new URL(AUTOCOMPLETE_API + encodeURIComponent(keyword));
  return request(url);
}
