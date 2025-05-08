"use client"
import { useState, ReactNode } from "react";
import { ProductsContext } from "../appContext/useProductsContext";



const ProductsContextProvider = ({ children }: {children: ReactNode}) => {
  const [products, setProducts] = useState<Array<any>>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <ProductsContext.Provider value={{products, setProducts, collapsed, setCollapsed }}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContextProvider;