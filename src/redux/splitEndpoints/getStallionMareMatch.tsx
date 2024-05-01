import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const getGeneralStallionMatches = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getGeneralStallionMatches: build.query<any, any>({
      query: (obj : any) =>
        prepareAPIQuery(api.baseUrl, api.stallionMareMatchUrl + obj.stallionId + '/' + obj.mareId,''),
        providesTags: () => [{ type: 'stallion match' }],
    }),
  }),
});

export const { useGetGeneralStallionMatchesQuery } = getGeneralStallionMatches;
