import { useContext } from 'react';
import GlobalValuesContext from 'src/contexts/GlobalValuesContext';

export const useGlobalValues = () => useContext(GlobalValuesContext)
