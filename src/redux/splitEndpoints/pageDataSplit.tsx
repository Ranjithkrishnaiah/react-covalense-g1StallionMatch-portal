import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const pageDataSplit = splitApi.injectEndpoints({
    endpoints: (build) => ({
        pageDataSplit: build.query<any, any>({
            query: (id) => (prepareAPIQuery(api.baseUrl, api.pageDateUrl + '/' + id, {})),
            keepUnusedDataFor: 0,
            providesTags: () => [{ type: 'Page Data' }],
        }),
    }),
});

export const { usePageDataSplitQuery } = pageDataSplit;