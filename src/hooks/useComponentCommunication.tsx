import { useContext } from 'react';
import CCContext from '../contexts/ComponentCommunication';

export const useCommunicate = () => useContext(CCContext)