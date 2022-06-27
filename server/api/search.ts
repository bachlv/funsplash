import { pexels, pixabay, unsplash } from '~/server/engines';
import {
  ApiErrorMessage,
  SearchParams,
  SearchResult,
  SearchResultImage,
} from 'server/types';

const search = cachedFunction(
  async (params: SearchParams): Promise<SearchResult> => {
    const [pexelsResult, pixabayResult, unsplashResult] = await Promise.all([
      pexels.search(params),
      pixabay.search(params),
      unsplash.search(params),
    ]);

    const queue: (Promise<SearchResultImage> | SearchResultImage)[] = [];

    pexelsResult.photos.forEach(async (p) => queue.push(pexels.getImage(p)));
    pixabayResult.hits.forEach((p) => queue.push(pixabay.getImage(p)));
    unsplashResult.results.forEach((p) => queue.push(unsplash.getImage(p)));

    const results = await Promise.all(queue);
    results.sort((a, b) => (a.blurhash < b.blurhash ? -1 : 1));

    return {
      total:
        pexelsResult.total_results +
        pixabayResult.totalHits +
        unsplashResult.total,
      results: results,
    };
  },
  {
    maxAge: useRuntimeConfig().cacheMaxAge,
  }
);

export default defineEventHandler(
  async (event): Promise<SearchResult | ApiErrorMessage> => {
    const params: SearchParams = useQuery(event);

    if (params.query == undefined || params.query === '') {
      event.res.statusCode = 400;
      return { error: 'Query, maybe?' };
    }

    const searchResult = await search(params);
    return searchResult;
  }
);
