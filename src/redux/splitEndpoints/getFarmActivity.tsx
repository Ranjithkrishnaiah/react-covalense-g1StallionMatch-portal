import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type FarmActivity = {
auditId: string;
attributeName: string;
oldValue: string;
newValue: string;
activityName: string;
farmName: string;
createdOn: string;
profilePic: string;
}

export const getFarmActivity = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getFarmActivity: build.query<FarmActivity[], any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.farmActivityUrl,params,true)),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'Farm Activity' }],
    }),
  }),
});

export const { useGetFarmActivityQuery } = getFarmActivity;