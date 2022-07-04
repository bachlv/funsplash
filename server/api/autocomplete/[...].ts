import { unsplash } from '~/server/engines';

export default defineEventHandler(async (event) => {
  const data = await unsplash.autocomplete(event.context.params._);
  return unsplash.getAutocomplete(data);
});
