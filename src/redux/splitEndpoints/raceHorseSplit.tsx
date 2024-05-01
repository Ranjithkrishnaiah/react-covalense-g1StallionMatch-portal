import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery, prepareAPIMutation } from 'src/utils/customFunctions';



export const apiWithRaceHorse = splitApi.injectEndpoints({
  endpoints: (build) => ({
    raceHorsePedigree: build.query<any, string>({
      query: (id: string) => (prepareAPIQuery(api.baseUrl, api.raceHorseUrl + "/" + id + '/pedigree', '')),
      keepUnusedDataFor: 60 * 60 * 24 * 365, //Keeps country data valid for an year
      providesTags: (result, error) => [{ type: 'RaceHorsePedigree' }],
    }),
    raceHorseStakesWinnersComparision: build.query<any, object>({
      query: (param) => (prepareAPIQuery(api.baseUrl, api.raceHorseUrl + "/stakes-winner-comparison", param)),
    }),
    raceHorseAptitudeProfile: build.query<any, any>({
      query: (params: any) => prepareAPIQuery(api.baseUrl, api.raceHorseUrl +"/smsearch-profile-details", params),
    }),
    raceHorseAutosearchHorseNames: build.query<any, any>({
      query: (data: any) => (prepareAPIQuery(api.baseUrl, api.raceHorseUrl + "/search-racehorse-byname", data)),
    }),
    raceHorseStakesWinnersComparisionOverlap: build.query<any, any>({
      query: (param) => (prepareAPIQuery(api.baseUrl, api.raceHorseUrl + "/pedigree-overlap/" + param.horseId + "/" + param.swId + "/" + param.generation, '')),
    }),
    validateUrl: build.mutation<any, any>({
      query: (inputParam) => (prepareAPIMutation(api.baseUrl, api.raceHorseUrl + '/validate-url', '', 'POST', inputParam)),
    }),
    raceHorsePedigreeDownloadPdf: build.query<any, any>({
      query: (param: any) => (prepareAPIQuery(api.baseUrl, api.raceHorseDownloadPdfUrl + param.horseId + '?t=' + param.rhtime, '')),
    }),
    raceHorsePedigreeOverlapDownloadPdf: build.query<any, any>({
      query: (param: any) => (prepareAPIQuery(api.baseUrl, api.raceHorseOverlapDownloadPdfUrl + param.horseId +"/"+ param.overlapId + '?t=' + param.rhtime, '')),
    }),
  }),
});

export const 
{ 
  useRaceHorsePedigreeQuery, 
  useRaceHorseStakesWinnersComparisionQuery, 
  useRaceHorseAptitudeProfileQuery,
  useRaceHorseAutosearchHorseNamesQuery,
  useRaceHorseStakesWinnersComparisionOverlapQuery,
  useValidateUrlMutation,
  useRaceHorsePedigreeDownloadPdfQuery,
  useRaceHorsePedigreeOverlapDownloadPdfQuery
} = apiWithRaceHorse;
