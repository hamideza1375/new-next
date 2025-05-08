'use client'
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export interface ProductsContextType {
    collapsed: boolean;
    setCollapsed: Dispatch<SetStateAction<boolean>>;
    products: Array<any>;
    setProducts: Dispatch<SetStateAction<Array<any>>>;
}


export const ProductsContext = createContext<ProductsContextType>(
    {
        collapsed: false,
        setCollapsed: () => { },
        products: [],
        setProducts: () => { },
    }
);
export const useProductsContext = () => {
    return useContext(ProductsContext);
};
