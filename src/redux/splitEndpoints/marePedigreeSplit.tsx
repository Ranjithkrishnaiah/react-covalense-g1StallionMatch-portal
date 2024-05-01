import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithMarePedigree = splitApi.injectEndpoints({
  endpoints: (build) => ({
    marePedigree: build.query<any, string>({
      query: (id: string) => (prepareAPIQuery(api.baseUrl, api.marePedigreeUrl + id + '/pedigree', '')),
      keepUnusedDataFor: 60 * 60 * 24 * 365, //Keeps country data valid for an year
      providesTags: (result, error) => [{ type: 'MarePedigree' }],
    }),
  }),
});

export const { useMarePedigreeQuery } = apiWithMarePedigree;
