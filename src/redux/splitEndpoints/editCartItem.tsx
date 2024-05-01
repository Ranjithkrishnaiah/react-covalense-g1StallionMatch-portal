import { api } from 'src/api/apiPaths';
import { prepareAPIMutation } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';
type InputParam = {
    cartId: number;
}

export const editCartItem = splitApi.injectEndpoints({
    endpoints: (build) =>({
        deleteCartItem: build.mutation<any,InputParam>({
            query: itemId => (prepareAPIMutation(api.baseUrl, api.cartItemUrl, '', 'PATCH', itemId, true)),
            invalidatesTags: ["CartItems"]
        })
    })
});

export const { useDeleteCartItemMutation } = editCartItem;