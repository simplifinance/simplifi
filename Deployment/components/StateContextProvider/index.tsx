import React from 'react';
import { storageInitialValueType, type StorageContextProps} from '@/storageContext';

export interface StorageContextProviderProp {
    value: StorageContextProps;
    children: React.ReactNode;
}

export const StorageContext = React.createContext(storageInitialValueType);

export const StorageContextProvider = ({ value, children } : StorageContextProviderProp) => {
    return(
        <StorageContext.Provider value={value}>
            { children }
        </StorageContext.Provider>
    );
}