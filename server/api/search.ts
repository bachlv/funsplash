import { pexels, pixabay, unsplash } from '~/server/engines';
import {
  ApiErrorMessage,
  SearchParams,
  SearchResult,
  SearchResultPhoto,
} from 'server/types';

const search = cachedFunction(
  async (params: SearchParams): Promise<SearchResult | any> => {
    const [pexelsResult, pixabayResult, unsplashResult] = await Promise.all([
      pexels.search(params),
      pixabay.search(params),
      unsplash.search(params),
    ]);

    const results: SearchResultPhoto[] = [];
    pexelsResult.photos.forEach((p) => results.push(pexels.getPhoto(p)));
    pixabayResult.hits.forEach((p) => results.push(pixabay.getPhoto(p)));
    unsplashResult.results.forEach((p) => results.push(unsplash.getPhoto(p)));

    results.sort((a, b) => (a.color < b.color ? -1 : 1));

    return {
      total: pexelsResult.total_results + unsplashResult.total,
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
