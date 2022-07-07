import { pexels, pixabay, unsplash } from '~/server/engines';

export default defineEventHandler(async (event) => {
  const id: string = event.context.params.id;
  const provider: string = id.slice(0, 2);
  const provider_id: string = id.slice(3);
  if (!provider_id) return;

  switch (provider) {
    case 'un':
      return unsplash.getImage(await unsplash.photos(provider_id));
    case 'pe':
      return pexels.getImage(await pexels.photos(provider_id));
    case 'pi':
      return pixabay.getImage((await pixabay.photos(provider_id)).hits[0]);
    default:
      break;
  }
});
