import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiAddToCartNomination = splitApi.injectEndpoints({
  endpoints: (build) => ({
    addToCartNomination: build.mutation<any, any>({
      query: (productDetails) => (
        prepareAPIMutation(api.baseUrl, api.addToCartUrl, '', 'POST', productDetails, true)
        ),
        invalidatesTags: [
            'CartItems',
            'AllMessages',
            'MessageFarmList',
            'getEnquiredFarms',
        ]
    }),
  }),
});

export const { useAddToCartNominationMutation } = apiAddToCartNomination