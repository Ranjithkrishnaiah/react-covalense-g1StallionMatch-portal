import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

interface DamSire {
    horseId: string;
    horseName: string,
    yob: number,
    countryCode: string
}
type SireResponse = {
  data: DamSire[];
}
type SireInput = {
    order: string,
    damSireName: string;
}
export const damsiresByName = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getdamsiresByName: build.query<SireResponse, SireInput>({
      query: (obj) => (prepareAPIQuery(api.baseUrl, api.damSiresByNameUrl , obj)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Dam Sire By Name' }],
    }),
  }),
});

export const { useGetdamsiresByNameQuery } = damsiresByName;