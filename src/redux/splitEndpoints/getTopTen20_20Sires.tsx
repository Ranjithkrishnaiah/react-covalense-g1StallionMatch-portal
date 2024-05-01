import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type TopT_TwentySires = {
DamsireId: string;
horseName: string;
profilePic: string;
galleryImage: string;
fee: number;
}
type TopT_TwentySiresResponse = {
  data: TopT_TwentySires,
}

export const getTopT_TwentySires = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getTopT_TwentySires: build.query<TopT_TwentySiresResponse, any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.topT_TwentySiresUrl,params,true)),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'Top 10 20/20 Matched Sires' }],
    }),
  }),
});

export const { useGetTopT_TwentySiresQuery } = getTopT_TwentySires;