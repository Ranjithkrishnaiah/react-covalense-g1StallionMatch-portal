import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation, prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithPostNominationRequest = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    postNominationRequest: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(api.baseUrl, api.nominationRequestUrl, '', 'POST', data, true),
      invalidatesTags: [
        'NominationRequestPost',
        'AllMessages',
        'MessageFarmList',
        'getEnquiredFarms',
      ],
    }),
    patchNominationRequest: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(api.baseUrl, api.nominationRequestUrl, '', 'PATCH', data, true),
      invalidatesTags: [
        'NominationRequestPost',
        'AllMessages',
        'MessageFarmList',
        'getEnquiredFarms',
      ],
    }),
    getNominationRequest: builder.query<any, any>({
      query: (id) => prepareAPIQuery(api.baseUrl, api.nominationRequestUrl + '/' + id, {}),
      // query: (data) => prepareAPIMutation(api.baseUrl, api.nominationRequestUrl, '', 'GET', data, true),
    }),
    getNominationRequestForStallionRoaster: builder.query<any, any>({
      query: (obj) => prepareAPIQuery(api.baseUrl, api.nominationRequestUrl + '/' + obj.currency + '/' + obj.fee + '/' +obj.feeCurrency, {}),
      // query: (data) => prepareAPIMutation(api.baseUrl, api.nominationRequestUrl, '', 'GET', data, true),
    }),
  }),
});

export const {
  usePostNominationRequestMutation,
  usePatchNominationRequestMutation,
  useGetNominationRequestQuery,
  useGetNominationRequestForStallionRoasterQuery
} = apiWithPostNominationRequest;
