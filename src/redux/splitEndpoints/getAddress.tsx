import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type Address = {
    address: string;
}
export const getAddress= splitApi.injectEndpoints({
    endpoints: (build) => ({
        getAddress: build.query<Address ,void>({
            query: () => (prepareAPIQuery(api.baseUrl, api.getAddressUrl, '', true)),
            keepUnusedDataFor: 0, 
            providesTags: (result, error) => [{ type: 'User Address' }],
        })
    })
});

export const { useGetAddressQuery } = getAddress;