import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type MostSearchedStallion = {
  stallionId: string;
  horseName: string;
  profilePic: string;
  galleryImage: string;
  currencyCode: string;
  currencySymbol: string;
  fee: number;
}
type MostSearchedStallionResponse = {
  data: MostSearchedStallion,
}

export const getMostPopularStallion = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getMostPopularStallion: build.query<MostSearchedStallionResponse, any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.mostPopularStallionUrl,params,true)),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'Most Popular Stallion' }],
    }),
  }),
});

export const { useGetMostPopularStallionQuery } = getMostPopularStallion;