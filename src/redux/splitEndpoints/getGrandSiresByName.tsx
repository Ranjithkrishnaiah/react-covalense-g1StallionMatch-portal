import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

interface GrandSire {
    horseId: string;
    horseName: string,
    yob: number,
    countryCode: string
}
type SireResponse = {
  data: GrandSire[];
}
type SireInput = {
    order: string,
    grandSireName: string;
}
export const damsiresByName = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getGrandsiresByName: build.query<SireResponse, SireInput>({
      query: (obj) => (prepareAPIQuery(api.baseUrl, api.grandSiresByNameUrl,obj)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Grand Sire By Name' }],
    }),
  }),
});

export const { useGetGrandsiresByNameQuery } = damsiresByName;