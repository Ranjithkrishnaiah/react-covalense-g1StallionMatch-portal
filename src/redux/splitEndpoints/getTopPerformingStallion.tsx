import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type TopPerformingStallion = {
stallionId: string;
horseName: string;
profilePic: string;
galleryImage: string;
currencyCode: string;
currencySymbol: string;
fee: number;
}
type TopPerformingStallionResponse = {
  data: TopPerformingStallion,
}

export const getTopPerformingStallion = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getTopPerformingStallion: build.query<TopPerformingStallionResponse, any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.topPerformingStallionUrl,params,true)),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'Top Performing Stallion' }],
    }),
  }),
});

export const { useGetTopPerformingStallionQuery } = getTopPerformingStallion;