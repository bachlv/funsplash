import { unsplash } from '~/server/engines';

export default defineEventHandler(async (event) => {
  return await unsplash.autocomplete(event.context.params._);
});
