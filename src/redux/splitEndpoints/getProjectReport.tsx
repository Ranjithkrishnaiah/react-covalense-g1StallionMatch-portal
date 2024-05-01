import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const getProjectReportsList = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getProjectReports: build.query<any, any>({
            query: () => (prepareAPIQuery(api.baseUrl, `${api.getProjectReportsData}?categoryId=1&currencyId=1`, '', true)),
            keepUnusedDataFor: 0,
            providesTags: (result, error) => [{ type: 'getProjectReportsData' }],
        }),
        getProjectReportsCurrencyInfo: build.query<any, any>({
            query: (param) => (prepareAPIQuery(api.baseUrl, api.getProjectReportsCurrencyInfoData, param, false)),
            keepUnusedDataFor: 0,
            providesTags: (result, error) => [{ type: 'getProjectReportsData' }],
        })
    })
});

export const { useGetProjectReportsQuery, useGetProjectReportsCurrencyInfoQuery } = getProjectReportsList;
