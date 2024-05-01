import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export type MyMare = {
  order: string;
  mareName: string;
}
export const apiWithSearchMareNames = splitApi.injectEndpoints({
  endpoints: (build) => ({
    searchMareNames: build.query<any, MyMare>({
      query: (data: any) => (prepareAPIQuery(api.baseUrl, api.searchMareNames, data)),
      providesTags: (result, error) => [{ type: 'searchMareNames' }],
      
    }),
  }),
});

export const { useSearchMareNamesQuery } = apiWithSearchMareNames;
