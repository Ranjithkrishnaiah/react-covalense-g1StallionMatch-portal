import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const getdowloadbreederreport = splitApi.injectEndpoints({
    endpoints: (build) => ({
        downloadBreederReport: build.query<any ,any>({
            query: (obj) => (prepareAPIQuery(api.baseUrl, api.downloadBreederReport,obj,true)),
            keepUnusedDataFor: 0, 
            providesTags: () => [{ type: 'getdownloadBreederReport' }],
        })
    })
});

export const { useDownloadBreederReportQuery } = getdowloadbreederreport;