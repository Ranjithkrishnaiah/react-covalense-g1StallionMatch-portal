import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithGetHorseDetailsById = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getHorseInfo: build.query<any, any>({
      query: (horseId: any) =>  (prepareAPIQuery(api.baseUrl, api.horseDetail + "/" + horseId + '/horse-modal-details', '')),
      providesTags: (result, error) => [{ type: 'horseDetails' }],
    }),
  }),
});

export const { useGetHorseInfoQuery } = apiWithGetHorseDetailsById;
