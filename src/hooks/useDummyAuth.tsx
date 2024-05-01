import { useContext } from 'react';
import DummyAuthContext from 'src/contexts/DummyAuth';

export const useDummyAuth = () => useContext(DummyAuthContext)