import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithGetMareListSplit = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getMareListSplit: build.query<any, object>({
      query: (params : any) =>  (prepareAPIQuery(api.baseUrl, api.getMareListsUrl , params,true)),
      providesTags : () => [{ type: 'Get MareLists CSV'}]
    }),
  }),
});

export const { useGetMareListSplitQuery } = apiWithGetMareListSplit;