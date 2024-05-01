import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithReportEmailValidation = splitApi.injectEndpoints({
  endpoints: (build) => ({
    reportEmailValidation: build.query<any, void>({
      query: (data: any) => (prepareAPIQuery(api.baseUrl, api.emailSubscriptionValid, data)),
      providesTags: (result, error) => [{ type: 'reportEmailValidation' }],
    }),
  }),
});

export const { useReportEmailValidationQuery } = apiWithReportEmailValidation;
