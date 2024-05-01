import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithGetColours = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getColours: build.query<any, void>({
      query: () => (prepareAPIQuery(api.baseUrl, api.coloursUrl, '')),
      keepUnusedDataFor: 5 * 60 * 60,
      transformResponse: (colours: any) => {
        let transformedColours: any[] = [];
        colours.map((colour: any) => {
          let { id, colourName: label } = colour;
          transformedColours.push({ id, label });
        });
        return transformedColours;
      },
      providesTags: (result, error) => [{ type: 'Colours' }],
    }),
    getDominancyColours: build.query<any, void>({
      query: () => (prepareAPIQuery(api.baseUrl, api.coloursUrl + '/master', '')),
      keepUnusedDataFor: 5 * 60 * 60,
      transformResponse: (colours: any) => {
        let transformedColours: any[] = [];
        colours.map((colour: any) => {
          let { id, colourName: label } = colour;
          transformedColours.push({ id, label });
        });
        return transformedColours;
      },
      providesTags: (result, error) => [{ type: 'Colours' }],
    }),
  }),
});

export const { useGetColoursQuery, useGetDominancyColoursQuery } = apiWithGetColours;
