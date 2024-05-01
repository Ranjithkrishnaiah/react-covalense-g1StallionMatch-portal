import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithPedigree = splitApi.injectEndpoints({
  endpoints: (build) => ({
    pedigree: build.query<any, string>({
      query: (id: string) => (prepareAPIQuery(api.baseUrl, api.horsePedigreeUrl + id + '/pedigree', '')),
      keepUnusedDataFor: 60 * 60 * 24 * 365, //Keeps country data valid for an year
      providesTags: (result, error) => [{ type: 'Pedigree' }],
    }),
    pedigreeWithLevel: build.query<any, object>({
      query: (params: any) => (prepareAPIQuery(api.baseUrl, api.horsePedigreeUrl + params.stallionId + '/pedigree/' + params.level, '')),
      keepUnusedDataFor: 60 * 60 * 24 * 365, //Keeps country data valid for an year
      providesTags: (result, error) => [{ type: 'Pedigree' }],
    }),
    getFarmLogosByStallionId: build.query<any, object>({
      query: (params: any) => (prepareAPIQuery(api.baseUrl, api.horsePedigreeUrl + params.stallionId + '/farms', '')),
      keepUnusedDataFor: 60 * 60 * 24 * 365, //Keeps country data valid for an year
      providesTags: (result, error) => [{ type: 'Pedigree' }],
    }),
  }),
});

export const { usePedigreeQuery, usePedigreeWithLevelQuery, useGetFarmLogosByStallionIdQuery } = apiWithPedigree;
