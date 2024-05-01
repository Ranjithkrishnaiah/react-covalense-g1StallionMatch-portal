import { StallionShortlist } from 'src/@types/StallionShortlist';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareHeaders, prepareAPIQuery, prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithStallionShortList = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    stallionShortlists: builder.query<StallionShortlist, object>({
      //query: () => api.stallionShortlist,
      query: (params) => (
        prepareAPIQuery(api.baseUrl, api.stallionShortlist, params, true)
      ),  
      providesTags: (result, error) => [{ type: 'stallionShortlist' }],
    }),
    stallionShortlistsIds: builder.query<any, object>({
      //query: () => api.stallionShortlist,
      query: (params) => (
        prepareAPIQuery(api.baseUrl, api.stallionShortlistIds, params, true)
      ),  
      providesTags: (result, error) => [{ type: 'stallionShortlist' }],
    }),
    addStallionShortlist: builder.mutation<{}, any>({
      query: (stallionShortlistPayload) => (
        prepareAPIMutation(api.baseUrl, api.stallionShortlist, '', 'POST', stallionShortlistPayload, true)
      ),
      invalidatesTags: ['stallionShortlist'],
    }),
    deleteStallionShortlist: builder.mutation<{}, string>({
      query: (param) => (
        prepareAPIMutation(api.baseUrl, api.stallionShortlist+'/'+param, '', 'DELETE', '', true)
      ),
      invalidatesTags: ['stallionShortlist'],
    }),
  }),
});

export const {
  useStallionShortlistsQuery,
  useAddStallionShortlistMutation,
  useDeleteStallionShortlistMutation,
  useStallionShortlistsIdsQuery
} = apiWithStallionShortList;
