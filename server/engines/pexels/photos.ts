import { PexelsImage } from './types';
import { request } from './utils';

export default async function (id: string): Promise<PexelsImage> {
  const url = new URL(process.env.ENGINE_PEXELS_API_URL + '/photos/' + id);
  return request(url);
}
