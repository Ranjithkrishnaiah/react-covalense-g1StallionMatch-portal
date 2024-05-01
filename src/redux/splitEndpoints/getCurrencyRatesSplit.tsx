import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithgetCurrencyRates = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getCurrencyRates: build.query<any ,void>({
            query: () => (prepareAPIQuery(api.baseUrl, api.currencyRatesUrl, '')),
            keepUnusedDataFor: 0, 
            providesTags: (result, error) => [{ type: 'CurrencyRates' }],
        })
    })
});

export const { useGetCurrencyRatesQuery } = apiWithgetCurrencyRates;