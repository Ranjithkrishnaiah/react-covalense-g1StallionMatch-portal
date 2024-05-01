import { api } from "src/api/apiPaths";
import { prepareAPIQuery } from "src/utils/customFunctions";
import { splitApi } from "../rootMiddleware";

export const getCurrentOrder = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getLatestOrder: build.query<any, void>({
            query: () => (prepareAPIQuery(api.baseUrl, api.getLatestOrderUrl, '', true)),
            providesTags: ['GET LATEST ORDER']
        })
    })
})

export const { useGetLatestOrderQuery } = getCurrentOrder;