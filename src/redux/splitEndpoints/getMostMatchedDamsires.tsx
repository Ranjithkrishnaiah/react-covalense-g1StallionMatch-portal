import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type MostMatchedDamsire = {
DamsireId: string;
horseName: string;
profilePic: string;
galleryImage: string;
fee: number;
}

export const getMostMatchedDamsire = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getMostMatchedDamsire: build.query<MostMatchedDamsire[], any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.mostMatchedDamsiresUrl,params,true)),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'Most Matched Damsires' }],
    }),
  }),
});

export const { useGetMostMatchedDamsireQuery } = getMostMatchedDamsire;