import { useContext } from 'react';
import OrderContext from 'src/contexts/OrderContext';

export const useOrderCount = () => useContext(OrderContext)