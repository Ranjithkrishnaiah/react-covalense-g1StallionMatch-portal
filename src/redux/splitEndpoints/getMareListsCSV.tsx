import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { api } from 'src/api/apiPaths';

const getMareListsCSV = splitApi.injectEndpoints({
    endpoints: (builder) => ({
        getMareLists : builder.query<any, any>({
            query: (params) => prepareAPIQuery(api.baseUrl, api.getMareListsUrl, params, true),
            providesTags : () => [{ type: 'Get MareLists CSV'}]
        }) 
    })
})

export const { useGetMareListsQuery } = getMareListsCSV;