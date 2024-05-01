// import { Favorite } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithPostSalesCatelogueReport = splitApi.injectEndpoints({
  endpoints: (build) => ({
    postSalesCatelogueReport: build.mutation<any, any>({
      query: (reportDetails) => (prepareAPIMutation(api.baseUrl, api.maresTableUrl, '', 'POST', reportDetails,true)),
    }),
  }),
});

export const { usePostSalesCatelogueReportMutation } = apiWithPostSalesCatelogueReport;