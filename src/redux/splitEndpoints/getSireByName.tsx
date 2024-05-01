import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

interface Sire {
    horseId: string;
    horseName: string,
    yob: number,
    countryCode: string
}
type SireResponse = {
  data: Sire[];
}
type SireInput = {
    order: string,
    sireName: string;
}
export const siresByName = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getSiresByName: build.query<SireResponse, SireInput>({
      query: (obj) => (prepareAPIQuery(api.baseUrl, api.siresByNameUrl,obj)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Sire By Name' }],
    }),
  }),
});

export const { useGetSiresByNameQuery } = siresByName;