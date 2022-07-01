import { request } from './utils';

const AUTOCOMPLETE_API = 'https://unsplash.com/nautocomplete/';

export default async function (keyword: string) {
  const url = new URL(AUTOCOMPLETE_API + encodeURIComponent(keyword));
  return request(url);
}
