import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type MostSearchedStallion = {
stallionId: string;
stallionName: string;
profilePic: string;
}
type MostSearchedStallionResponse = {
  data: MostSearchedStallion[],
  meta: object
}

export const getMostSearchedStallions = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getMostSearchedStallions: build.query<MostSearchedStallionResponse, any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.mostSearchedStallionsUrl,params,true)),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'Most Searched Stallions' }],
    }),
  }),
});

export const { useGetMostSearchedStallionsQuery } = getMostSearchedStallions;