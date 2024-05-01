import { api } from "src/api/apiPaths";
import { prepareAPIQuery } from "src/utils/customFunctions";
import { splitApi } from "../rootMiddleware";

export const apiWithGetYearToStud = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getYearToStud: build.query<any ,void>({
            query: () => (prepareAPIQuery(api.baseUrl, api.YearToStudUrl, '')),
            keepUnusedDataFor: 0, 
            transformResponse: (years : any, meta, arg) => {
                let transformedYears : any[] = [];
                years.map((year: any) => {
                    let { id, value: label } = year;
                    transformedYears.push({ id, label: label.toString() })
                })
                return transformedYears;
            },
            providesTags: (result, error) => [{ type: 'YearToStud' }],
        })
    })
})
export const { useGetYearToStudQuery } = apiWithGetYearToStud;