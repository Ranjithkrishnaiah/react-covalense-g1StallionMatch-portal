import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery, prepareAPIMutation } from 'src/utils/customFunctions';

const geoCountry = localStorage.getItem('geoCountryName');
export const apiWithPerfectMatch = splitApi.injectEndpoints({
  endpoints: (build) => ({
    perfectMatch: build.query<any, any>({
      query: (param: any) => (prepareAPIQuery(api.baseUrl, api.perfectMatch + param.stallionId +"/"+param.mareId +"/"+param.generation + "?countryName=" + geoCountry, '')),
    }),
    authPerfectMatch: build.query<any, any>({
      query: (param: any) => (prepareAPIQuery(api.baseUrl, api.authPerfectMatch + param.stallionId +"/"+param.mareId +"/"+param.generation + "?countryName=" + geoCountry, '', true)),
    }),
    searchDownloadPdf: build.query<any, any>({
      query: (param: any) => (prepareAPIQuery(api.baseUrl, api.searchDownload + param.stallionId +"/"+param.mareId, '')),
    }),
    pedigreeOverlapDownloadPdf: build.query<any, any>({
      query: (param: any) => (prepareAPIQuery(api.baseUrl, api.pedigreeOverlapDownload + param.stallionId +"/"+ param.mareId +"/"+ param.swId, '')),
    }),
  }),
});

export const { usePerfectMatchQuery, useAuthPerfectMatchQuery, useSearchDownloadPdfQuery, usePedigreeOverlapDownloadPdfQuery } = apiWithPerfectMatch;
