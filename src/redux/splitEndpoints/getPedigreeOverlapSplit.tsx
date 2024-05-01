import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery, prepareAPIMutation } from 'src/utils/customFunctions';

export const getPedigreeOverlap = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getHypomatingPedigreeOverlap: build.query<any, any>({
      query: (param: any) => (prepareAPIQuery(api.baseUrl, api.pedigreeOverlap + param.stallionId +"/"+param.mareId +"/"+param.swId +"/"+param.generation, '')),
    }),
  }),
});

export const { useGetHypomatingPedigreeOverlapQuery } = getPedigreeOverlap;
