import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const getStallionMatchActivityFarms = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getStallionMatchActivityFarms: build.query<any, any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.stallionMatchedActivityFarms,params,true)),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetStallionMatchActivityFarmsQuery } = getStallionMatchActivityFarms;