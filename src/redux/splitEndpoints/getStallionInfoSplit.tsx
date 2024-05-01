import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithgetStallionInfo = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getStallionInfo: build.query<any, any>({
      query: (stallionId: any) =>
        prepareAPIQuery(
          api.baseUrl,
          api.stallionDetailsURL + '/' + stallionId + '/stallion-info?isCache='+ (Math.random() + 1).toString(36).substring(7),
          '',true
        ),
       keepUnusedDataFor: 0,
      //   providesTags: (result, error) => [{ type: 'stallionDetails' }],
    }),
  }),
});

export const { useGetStallionInfoQuery } = apiWithgetStallionInfo;
