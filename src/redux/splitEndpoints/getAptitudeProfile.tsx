import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

//Needs to be reimplemented once the api is provided
export const apiWithgetAptitudeProfile = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getAptitudeProfile: build.query<any, any>({
      query: (params: any) =>
        prepareAPIQuery(api.baseUrl, '/stallions'+api.aptitudeProfileURL, params),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'aptitudeProfile' }],
    }),
  }),
});

export const { useGetAptitudeProfileQuery } = apiWithgetAptitudeProfile;
