import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type InputSire = {
    order: string;
    farmName: string;
  }
export const searchFarmByName = splitApi.injectEndpoints({
  endpoints: (build) => ({
    searchFarmName: build.query<any, InputSire>({
      query: (data: any) => (prepareAPIQuery(api.baseUrl, api.searchFarmNamesUrl, data)),
      providesTags: (result, error) => [{ type: 'searchFarmByName' }],
    }),
  }),
});

export const { useSearchFarmNameQuery } = searchFarmByName;