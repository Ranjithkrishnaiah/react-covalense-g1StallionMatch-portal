import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithPatchNominationOffer = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    patchNominationOffer: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(api.baseUrl, api.nominationRequestUrl, '', 'PATCH', data, true),
      invalidatesTags: [
        'PatchNominationOffer',
        'AllMessages',
        'MessageFarmList',
        'getEnquiredFarms',
      ],
    }),
    patchNominationOfferRemoveCart: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(api.baseUrl, api.nominationRequestUrl + '/remove-cart/' + data.id, '', 'PATCH', {'isAccepted':data?.isAccepted}, true),
      invalidatesTags: [
        'PatchNominationOffer',
        'AllMessages',
        'MessageFarmList',
        'getEnquiredFarms',
      ],
    }),
  }),
});

export const { usePatchNominationOfferMutation,usePatchNominationOfferRemoveCartMutation } = apiWithPatchNominationOffer;
