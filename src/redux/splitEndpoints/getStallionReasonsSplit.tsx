import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithgetStallionReasons = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getStallionReasons: build.query<any, void>({
      query: () => (prepareAPIQuery(api.baseUrl, api.stallionReasonsUrl, '', true)),
    }),
  }),
});

export const { useGetStallionReasonsQuery } = apiWithgetStallionReasons;