import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';


//Needs to be reimplemented once the api is provided
export const apiWithgetReportSaleDetailsList = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getReportSaleDetailsList: build.query<any, void>({
      query: (stallionId: any) =>  (prepareAPIQuery(api.baseUrl, api.stallionDetailsURL + '/' + stallionId, '')),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetReportSaleDetailsListQuery } = apiWithgetReportSaleDetailsList;