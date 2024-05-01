import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const getbreederreportKeyStats = splitApi.injectEndpoints({
    endpoints: (build) => ({
        breederReportKeyStats: build.query<any ,any>({
            query: (obj) => (prepareAPIQuery(api.baseUrl, api.breederKeyStatistics,obj,true)),
            keepUnusedDataFor: 0, 
        })
    })
});

export const { useBreederReportKeyStatsQuery } = getbreederreportKeyStats;