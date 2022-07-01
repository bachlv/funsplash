import { unsplash } from '~/server/engines';
import { UnsplashImage } from '~/server/engines/unsplash/types';

export default defineEventHandler(async (event): Promise<UnsplashImage> => {
  return await unsplash.random();
});
