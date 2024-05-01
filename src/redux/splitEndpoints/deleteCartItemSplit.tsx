import { api } from 'src/api/apiPaths';
import { prepareAPIMutation } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';
type InputParam = {
    cartId: string;
}

export const deleteCartItem = splitApi.injectEndpoints({
    endpoints: (build) =>({
        deleteCartItem: build.mutation<any,InputParam>({
            query: itemId => (prepareAPIMutation(api.baseUrl, api.cartItemUrl, '', 'DELETE', itemId, true)),
            invalidatesTags: ["CartItems","stallionRoster"]
        })
    })
});

export const { useDeleteCartItemMutation } = deleteCartItem;