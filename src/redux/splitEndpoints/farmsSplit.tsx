import { StallionList } from 'src/@types/stallionList';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation, prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithFarms = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    farms: builder.query<StallionList, object>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.farmsUrl, params)),
      providesTags: (result, error) => [{ type: 'farms' }],
    }),
    getAuthFarmlist: builder.query<any, object>({ 
      query: () => (
        prepareAPIQuery(api.baseUrl, api.authFarmList, '', true)
      ),
      providesTags: (result, error) => [{ type: 'AuthFarmlist' }],
    }),
    farmPageView: builder.mutation<any, any>({
      query: (data) => (prepareAPIMutation(api.baseUrl, api.farmsUrl +'/'+ api.farmPageView + data.farmId, '', 'POST',  {'referrer':data.referrer}, true))
    }),
    farmPageViewAuth: builder.mutation<any, any>({
      query: (data) => (prepareAPIMutation(api.baseUrl, api.farmsUrl +'/'+ api.farmPageAuthView + data.farmId, '', 'POST',  {'referrer':data.referrer}, true))
    }),
    farmPageShareAuth: builder.mutation<any, any>({
      query: (data) => (prepareAPIMutation(api.baseUrl, api.farmsUrl +'/farm-page-social-share/'+ data.farmId, '', 'POST',  {'socialShareType': data.referrer}, true))
    }),
  }),
});

export const { useFarmsQuery,useGetAuthFarmlistQuery,useFarmPageViewMutation, useFarmPageViewAuthMutation, useFarmPageShareAuthMutation } = apiWithFarms;
