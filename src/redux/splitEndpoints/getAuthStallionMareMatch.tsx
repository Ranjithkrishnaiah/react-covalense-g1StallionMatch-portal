import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const getAuthGeneralStallionMatches = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getAuthGeneralStallionMatches: build.query<any, any>({
      query: (obj : any) =>
        prepareAPIQuery(api.baseUrl, api.authStallionMareMatchUrl + obj.stallionId + '/' + obj.mareId,'', true),
        providesTags: () => [{ type: 'auth stallion match' }],
    }),
  }),
});

export const { useGetAuthGeneralStallionMatchesQuery } = getAuthGeneralStallionMatches;