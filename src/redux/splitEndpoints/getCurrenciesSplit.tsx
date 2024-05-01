import { api } from "src/api/apiPaths";
import { splitApi } from "../rootMiddleware";
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithGetCurrencies = splitApi.injectEndpoints({    
    endpoints: (build) => ({
        getCurrencies: build.query<any ,void>({
            query: () => (prepareAPIQuery(api.baseUrl, api.currenciesUrl, '')),
            keepUnusedDataFor: 5*60*60, 
            transformResponse: (currencies : any) => {
                let transformedCurrencies : any[] = [];
                currencies.map((currency: any) => {
                    let { id, currencyCode: label, currencySymbol:currencySymbol } = currency;
                    transformedCurrencies.push({ id, label, currencySymbol })
                })
                return transformedCurrencies;
            },
            providesTags: (result, error) => [{ type: 'Currencies' }],
        }),
        getCurrenciesMinMaxvalue: build.query<any, void>({
            query: (params) => prepareAPIQuery(api.baseUrl, api.stallionCurrenciesUrl, params),
            keepUnusedDataFor: 0,
            providesTags: (result, error) => [{ type: 'currenciesMinMaxvalue' }],
        }),
        getMinMaxPricingSlidervalue: build.query<any, void>({
            query: (params) => prepareAPIQuery(api.baseUrl, api.minMaxPrice, params),
            keepUnusedDataFor: 0,
            providesTags: (result, error) => [{ type: 'currenciesMinMaxvalue' }],
        }),
    })
    
})
export const { useGetCurrenciesQuery,useGetCurrenciesMinMaxvalueQuery ,useGetMinMaxPricingSlidervalueQuery} = apiWithGetCurrencies;