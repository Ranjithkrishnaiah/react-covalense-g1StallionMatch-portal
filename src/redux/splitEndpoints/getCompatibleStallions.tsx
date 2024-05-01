import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const compatibleStallions = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getCompatibleStallions: build.query<any, any>({
      query: (param) => prepareAPIQuery(api.baseUrl, api.stakeswinOverlap+param?.horseId+"/compatible-stallions", '', true),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'compatible-stallions' }],
    }),
  }),
});

export const { useGetCompatibleStallionsQuery } = compatibleStallions;