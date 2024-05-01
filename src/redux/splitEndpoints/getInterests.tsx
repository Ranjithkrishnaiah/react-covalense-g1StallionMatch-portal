import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';
type Interest = {
    id: number;
    name: string;
  }
export const GetInterests = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getInterests: build.query<Interest[] ,void>({
            query: () => (prepareAPIQuery(api.baseUrl, api.interestsUrl,'')),
            keepUnusedDataFor: 0, 
            providesTags: (result, error) => [{ type: 'Interests' }],
        })
    })
});

export const { useGetInterestsQuery } = GetInterests;