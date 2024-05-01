import { Sales } from 'src/@types/sales';
import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithSales = splitApi.injectEndpoints({
  endpoints: (build) => ({
    SelectLots: build.query<Sales[], any>({
      query: (ids) => prepareAPIQuery(api.baseUrl, api.selectLot + ids, ''),
      // @ts-ignore
      providesTags: (result, error) => [{ type: 'Lots' }],
    }),
  }),
});

export const { useSelectLotsQuery } = apiWithSales;