import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

//Needs to be reimplemented once the api is provided
export const apiwithGetStallionMatchActivity = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getStallionMatchActivity: build.query<any, void>({
      query: (params?: any) =>
        prepareAPIQuery(api.baseUrl, api.activities + '/stallion-match', params, true),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetStallionMatchActivityQuery } = apiwithGetStallionMatchActivity;
