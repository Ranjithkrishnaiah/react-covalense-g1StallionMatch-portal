import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery, prepareAPIMutation } from 'src/utils/customFunctions';

export const getOverlapStakesWin = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getStakesWinOverlap: build.query<any, any>({
      query: (param: any) => (prepareAPIQuery(api.baseUrl, api.stakeswinOverlap + param.stallionId +"/stakes", '')),
    }),
  }),
});

export const { useGetStakesWinOverlapQuery } = getOverlapStakesWin;
