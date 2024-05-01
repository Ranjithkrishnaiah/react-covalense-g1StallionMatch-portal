import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';


//Needs to be reimplemented once the api is provided
export const apiWithgetReportsOrdered = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getReportsOrdered: build.query<any, any>({
      query: (stallionId: any) =>  (prepareAPIQuery(api.baseUrl, api.stallionDetailsURL + '/' + stallionId, '')),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetReportsOrderedQuery } = apiWithgetReportsOrdered;