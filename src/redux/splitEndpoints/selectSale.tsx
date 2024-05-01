import { Sales } from 'src/@types/sales';
import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithSales = splitApi.injectEndpoints({
  endpoints: (build) => ({
    SelectSales: build.query<Sales[], any>({
      query: (id) => prepareAPIQuery(api.baseUrl, api.selectSale + String(id), ''),
      // @ts-ignore
      providesTags: (result, error) => [{ type: 'Sales' }],
    }),
  }),
});

export const { useSelectSalesQuery } = apiWithSales;