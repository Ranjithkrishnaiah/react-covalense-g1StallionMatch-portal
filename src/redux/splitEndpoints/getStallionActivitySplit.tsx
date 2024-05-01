import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';


//Needs to be reimplemented once the api is provided
export const apiWithgetStallionActivity = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getStallionActivity: build.query<any, void>({
      query: (params : any) =>  (prepareAPIQuery(api.baseUrl, api.activities + '/stallion' , params,true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Stallion Activity' }],
    }),
  }),
});

export const { useGetStallionActivityQuery } = apiWithgetStallionActivity;