import { Address } from 'src/@types/profile';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const editAddress = splitApi.injectEndpoints({
  endpoints: (build) => ({
    editAddress: build.mutation<any, Address>({
      query: (address) => (
        prepareAPIMutation(api.baseUrl, api.editAddressUrl, '', 'PATCH', address, true)
        ),
        invalidatesTags: ['profileDetails']
    }),
  }),
});

export const { useEditAddressMutation } = editAddress;
