import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const getdowloadStallionreport = splitApi.injectEndpoints({
    endpoints: (build) => ({
        downloadStallionReport: build.query<any ,any>({
            query: (obj) => (prepareAPIQuery(api.baseUrl, api.stallionDownloadReport,obj,true)),
            keepUnusedDataFor: 0, 
            // providesTags: () => [{ type: 'getdownloadBreederReport' }],
        })
    })
});

export const { useDownloadStallionReportQuery } = getdowloadStallionreport;