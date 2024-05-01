import { StallionList } from 'src/@types/stallionList';
import { api } from '../../api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareHeaders, prepareAPIQuery, prepareAPIMutation } from "src/utils/customFunctions";
import { ProgenyTracker } from 'src/@types/ProgenyTracker';

type ProgenyTrackerInput = {
  stallionId: string;
  fromDate: string;
  toDate: string;
  page: number;
  limit: number;
  filterBy:string;
}

export const apiWithStallion = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    stallions: builder.query<StallionList, object>({
      query: (params) => (
        prepareAPIQuery(api.baseUrl, api.stallions, params)
      ),      
      providesTags: (result, error) => [{ type: 'stallions' }],      
    }),
    stallionPageView: builder.mutation<any, any>({
      query: (data) => (prepareAPIMutation(api.baseUrl, api.stallionPageView + data.stallionId, '', 'POST', {'referrer':data.referrer}, true))
    }),
    stallionPageViewAuth: builder.mutation<any, any>({
      query: (data) => (prepareAPIMutation(api.baseUrl, api.stallionPageViewAuth + data.stallionId, '', 'POST', {'referrer':data.referrer}, true))
    }),
    progenyTracker: builder.query<any, ProgenyTrackerInput>({
      query: (params) => prepareAPIQuery(api.baseUrl, '/' + api.progenyTracker, params, true),
      providesTags: (result, error) => [{ type: 'progenyTracker' }],
    }),
    stallionPageShareAuth: builder.mutation<any, any>({
      query: (data) => (prepareAPIMutation(api.baseUrl, api.stallions +'/stallion-page-social-share/'+ data.stallionId, '', 'POST',  {'socialShareType': data.referrer}, true))
    }),
  }),
});

export const { useStallionsQuery,useStallionPageViewMutation,useStallionPageViewAuthMutation,useProgenyTrackerQuery, useStallionPageShareAuthMutation } = apiWithStallion;

// {
//   url: `${api.baseUrl}/${api.stallions}`,
//   params: params,
//   headers: prepareHeaders(),        
// }