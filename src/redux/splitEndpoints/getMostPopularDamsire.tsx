import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type MostPopularDamsire = {
DamsireId: string;
horseName: string;
profilePic: string;
galleryImage: string;
fee: number;
}
type MostPopularDamsireResponse = {
  data: MostPopularDamsire,
}

export const getMostPopularDamsire = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getMostPopularDamsire: build.query<MostPopularDamsireResponse, any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.mostPopularDamsireUrl,params,true)),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'Most Popular Damsire' }],
    }),
  }),
});

export const { useGetMostPopularDamsireQuery } = getMostPopularDamsire;