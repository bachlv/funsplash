import { pexels, pixabay, unsplash } from '~/server/engines';
import {
  ApiErrorMessage,
  SearchParams,
  SearchResult,
  SearchResultImage,
} from '~/types';

const search = cachedFunction(
  async (params: SearchParams): Promise<SearchResult> => {
    const searchApiResult = await Promise.all([
      pexels.search(params).catch((err) => console.error(err)),
      pixabay.search(params).catch((err) => console.error(err)),
      unsplash.search(params).catch((err) => console.error(err)),
    ]);
    const [pexelsResult, pixabayResult, unsplashResult] = searchApiResult;

    const queue: (Promise<SearchResultImage> | SearchResultImage)[] = [];

    if (pexelsResult)
      pexelsResult.photos.forEach(async (p) => queue.push(pexels.getImage(p)));
    if (pixabayResult)
      pixabayResult.hits.forEach((p) => queue.push(pixabay.getImage(p)));
    if (unsplashResult)
      unsplashResult.results.forEach((p) => queue.push(unsplash.getImage(p)));

    const results = await Promise.all(queue);
    results.sort(() => 0.5 - Math.random());

    return {
      results: results,
    };
  },
  {
    maxAge: useRuntimeConfig().cacheMaxAge,
  }
);

export default defineEventHandler(
  async (event): Promise<SearchResult | ApiErrorMessage> => {
    const params: Partial<SearchParams> = useQuery(event);

    if (params.query == undefined || params.query === '') {
      event.res.statusCode = 400;
      return { error: 'Query, maybe?' };
    }
    params.query = params.query.replace(/-+/g, ' ');

    if (params.page && !isFinite(parseInt(params.page as string))) {
      event.res.statusCode = 400;
      return { error: 'What page is it?' };
    }

    try {
      const searchResult = await search(params);
      return searchResult;
    } catch (err) {
      event.res.statusCode = 400;
      return { error: err.message };
    }
  }
);
