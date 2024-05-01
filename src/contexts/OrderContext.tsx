import { createContext, useState } from 'react';
import { ReactChildProp } from '../@types/typeUtils'

type OrderContextType = {
    orderCount: number;
    setOrderCount: React.Dispatch<React.SetStateAction<number>>
}
const OrderContext = createContext<OrderContextType>({} as OrderContextType)

export const OrderCountProvider = ({ children }: ReactChildProp) => {
    const [ orderCount, setOrderCount ] = useState(0);
    return(
        <OrderContext.Provider value = { { orderCount, setOrderCount } }>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContext;