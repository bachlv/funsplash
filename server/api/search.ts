import { pexels, unsplash } from '~/server/engines';
import {
  ErrorMessage,
  SearchParams,
  SearchResult,
  SearchResultPhoto,
} from 'server/types';

const search = cachedFunction(
  async (params: SearchParams): Promise<SearchResult> => {
    const [pexelsResult, unsplashResult] = await Promise.all([
      pexels.search(params),
      unsplash.search(params),
    ]);

    const results: SearchResultPhoto[] = [];
    pexelsResult.photos.forEach((p) => results.push(pexels.getPhoto(p)));
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
  async (event): Promise<SearchResult | ErrorMessage> => {
    const params: SearchParams = useQuery(event);

    if (params.query == undefined || params.query === '') {
      event.res.statusCode = 400;
      return { error: 'Query, maybe?' };
    }

    const searchResult = await search(params);
    return searchResult;
  }
);
