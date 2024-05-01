import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type InputBroodmareSire = {
  order: string;
  damSireName: string;
}
export const apiWithSearchBroodmareSireNames = splitApi.injectEndpoints({
  endpoints: (build) => ({
    searchBroodmareSireNames: build.query<any, InputBroodmareSire>({
      query: (data: any) => (prepareAPIQuery(api.baseUrl, api.searchBroodmareSireNamesUrl, data)),
      providesTags: (result, error) => [{ type: 'searchBroodmareSireNames' }],
      transformResponse: (sires : any[]) => {
        let transformedArray: any[] = [];
        sires.map((sire: any) => {
          transformedArray.push({id: sire.horseId, name: sire.horseName, yob : sire.yob, 
            countryCode: sire.countryCode,damName:sire.damName,damYob:sire.damYob,damUuid:sire.damUuid,damCountryCode:sire.damcountryCode,
            sireName:sire.sireName,sireYob:sire.sireYob,sireUuid:sire.sireUuid,sireCountryCode:sire.sirecountryCode})
        })
        
        return transformedArray;
    },
    }),
  }),
});

export const { useSearchBroodmareSireNamesQuery } = apiWithSearchBroodmareSireNames;
