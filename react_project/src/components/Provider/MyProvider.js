import React, { createContext, useContext, useState } from 'react';

const MyProvider = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  return (
    <MyProvider.Provider value={{ products, setProducts ,currentCategory, setCurrentCategory}}>
      {children}
    </MyProvider.Provider>
  );
};

export const useProducts = () => {
  return useContext(MyProvider);
};
