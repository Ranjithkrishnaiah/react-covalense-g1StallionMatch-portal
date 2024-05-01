import { api } from 'src/api/apiPaths';
import { prepareAPIQuery, prepareHeaders } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type InputStallion = {
  order: string;
  stallionName: string;
}
export const apiWithSearchStallionNames = splitApi.injectEndpoints({
  endpoints: (build) => ({
    searchStallionNames: build.query<any, InputStallion>({
      query: (data: any) => (prepareAPIQuery(api.baseUrl, api.searchStallionNames, data, true)),
      providesTags: (result, error) => [{ type: 'searchStallionNames' }],
      transformResponse: (stallions: any[]) => {
        let transformedArray: any[] = [];
        stallions.map((stallion: any) => {
          transformedArray.push({
            id: stallion.stallionId, name: stallion.stallionName, yob: stallion.yob,
            countryCode: stallion.countryCode, damName: stallion.damName, damYob: stallion.damYob, damId: stallion.damId, damCountryCode: stallion.damCountryCode,
            sireName: stallion.sireName, sireYob: stallion.sireYob, sireId: stallion.sireId, sireCountryCode: stallion.sireCountryCode, stallionFarmName: stallion.farmName
          })
        })

        return transformedArray;
      },
    }),
    autosearchStallionNames: build.query<any, InputStallion>({
      query: (data: any) => (prepareAPIQuery(api.baseUrl, api.searchStallionNames, data, true)),
      // providesTags: (result, error) => [{ type: 'searchStallionNames' }],
    }),
    stallionNamesListForFarms: build.query<any, any>({
      query: (data: any) => (prepareAPIQuery(api.baseUrl, `/farms/${data}/stallions-with-inbreeding`, {}, false)),
      // query: (data: any) => ({url: `${api.baseUrl}/farms/${data}/stallions-with-inbreeding`,headers:prepareHeaders()}),
      // providesTags: (result, error) => [{ type: 'searchStallionNames' }],
    }),
    autosearchStallionUsers: build.query<any, any>({
      query: () => (prepareAPIQuery(api.baseUrl, api.searchStallionUsers, '', true)),
      // providesTags: (result, error) => [{ type: 'searchStallionUsers' }],
    }),
    myDamSireSearched: build.query<any, any>({
      query: () => (prepareAPIQuery(api.baseUrl, api.myDamsiresSearched, '', true)),
      // providesTags: (result, error) => [{ type: 'searchStallionUsers' }],
    }),
    footerAutoSearch: build.query<any, InputStallion>({
      query: (data: any) => (prepareAPIQuery(api.baseUrl, api.footerSearchUrl, data)),
    }),
  }),
});

export const {
  useSearchStallionNamesQuery,
  useAutosearchStallionNamesQuery,
  useAutosearchStallionUsersQuery,
  useMyDamSireSearchedQuery,
  useStallionNamesListForFarmsQuery,
  useFooterAutoSearchQuery
} = apiWithSearchStallionNames;
