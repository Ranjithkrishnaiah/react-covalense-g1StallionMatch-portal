// import { Favorite } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithPostShortListReport = splitApi.injectEndpoints({
  endpoints: (build) => ({
    postShortListReport: build.mutation<any, any>({
      query: (reportDetails) => (prepareAPIMutation(api.baseUrl, api.maresTableUrl, '', 'POST', reportDetails,true)),
    }),
  }),
});

export const { usePostShortListReportMutation } = apiWithPostShortListReport;