import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';
type EmailInput = {
    email: string;
}
export const getIfEmailAddressExists = splitApi.injectEndpoints({
    endpoints: (build) => ({
        checkIfEmailAddressExists: build.query<any ,EmailInput>({
            query: (obj) => (prepareAPIQuery(api.baseUrl, api.emailExistsUrl,obj)),
            keepUnusedDataFor: 0, 
            providesTags: (result, error) => [{ type: 'Interests' }],
        })
    })
});

export const { useCheckIfEmailAddressExistsQuery } = getIfEmailAddressExists;