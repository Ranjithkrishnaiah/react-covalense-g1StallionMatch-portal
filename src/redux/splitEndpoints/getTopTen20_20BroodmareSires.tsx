import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type TopT_TwentyBroodmareSires = {
DamsireId: string;
horseName: string;
profilePic: string;
galleryImage: string;
fee: number;
}
type TopT_TwentyBroodmareSiresResponse = {
  data: TopT_TwentyBroodmareSires,
}

export const getTopT_TwentyBroodmareSires = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getTopT_TwentyBroodmareSires: build.query<TopT_TwentyBroodmareSiresResponse, any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.topT_TwentyBroodmareSiresUrl,params,true)),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'Top 10 20/20 Matched Broodmare Sires' }],
    }),
  }),
});

export const { useGetTopT_TwentyBroodmareSiresQuery } = getTopT_TwentyBroodmareSires;