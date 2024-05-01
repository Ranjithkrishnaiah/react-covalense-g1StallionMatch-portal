import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithPostBoostProfile = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    postBoostLocalProfile: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(api.baseUrl, api.addToCartUrl + '/local-boost', '', 'POST', data, true),
      invalidatesTags: ['boostCart','CartItems'],
    }),

    postBoostExtendedProfile: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(
          api.baseUrl,
          api.addToCartUrl + '/extended-boost',
          '',
          'POST',
          data,
          true
        ),
      invalidatesTags: ['boostCart','CartItems'],
    }),

    postExtendedPotentialAudience: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(
          api.baseUrl,
          api.addToCartUrl + '/potential-audience',
          '',
          'POST',
          data,
          true
        ),
      invalidatesTags: ['boostCart'],
    }),
  }),
});

export const {
  usePostBoostLocalProfileMutation,
  usePostBoostExtendedProfileMutation,
  usePostExtendedPotentialAudienceMutation,
} = apiWithPostBoostProfile;
