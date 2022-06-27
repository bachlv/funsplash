import { SearchResultImage } from '~/server/types';
import { PexelsImage } from './types';
import { getBlurhash } from '../utils';

export const getImage = async (
  photo: PexelsImage
): Promise<SearchResultImage> => ({
  id: 'pe-' + photo.id,
  width: photo.width,
  height: photo.height,
  description: photo.alt,
  blurhash: await getBlurhash(
    photo.src.original + '?auto=compress&cs=tinysrgb&dpr=1&w=32'
  ),
  src: {
    original: photo.src.original,
    regular: photo.src.large,
    small: photo.src.small,
    thumb: photo.src.tiny,
  },
  photographer: photo.photographer,
  link: photo.url,
});
