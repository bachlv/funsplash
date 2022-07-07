import { UnsplashImage } from './types';
import { request } from './utils';

export default async function (id: string): Promise<UnsplashImage> {
  const url = new URL(process.env.ENGINE_UNSPLASH_API_URL + '/photos/' + id);
  return request(url);
}
