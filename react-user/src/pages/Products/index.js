import { useEffect, useState,useRef } from "react";
import { getProductsByCategory } from "~/services/productServices";
import { useLocation, useSearchParams } from "react-router-dom";
import ProductCard from "~/components/ProductCard/ProductCard";
import classNames from "classnames/bind";
import styles from "./product.module.scss";
import { buildImageUrl } from "~/utils/imageUtils";
const cx = classNames.bind(styles);

function Products() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const location = useLocation(); // Lấy state chứa ID
  const [searchParams, setSearchParams] = useSearchParams();
  const brandQuery = searchParams.get("brand");
  const categoryIdRef = useRef(location.state?.categoryId|| searchParams.get("categoryId"));
  useEffect(() => {
    const fetchProducts = async () => {
      const categoryId = categoryIdRef.current;
      if (categoryId) {
        try {
          const data = await getProductsByCategory(categoryId);
          const filteredProducts = filterProductsByBrand(data, brandQuery);
          setProducts(filteredProducts);
          setBrands(extractUniqueBrands(data));
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      } else {
        console.warn("categoryId is undefined. Ensure it's passed correctly.");
      }
    };

    fetchProducts();
  }, [brandQuery]);

  const extractUniqueBrands = (products) => {
    // Sử dụng Map để loại bỏ trùng lặp theo tên brand
    return Array.from(
      products.reduce((map, product) => {
        const brand = product.brand;
        if (brand?.name && brand?.imageBrand_url) {
          map.set(brand.name, brand.imageBrand_url); 
        }
        return map;
      }, new Map())
    ).map(([name, imageBrand_url]) => ({ name, imageBrand_url }));
  };
  const filterProductsByBrand = (products, brand) => {
    return brand ? products.filter((p) => p.brand?.name === brand) : products;
   
  };
  

  const handleBrandClick = (brandName) => {
    const queryParams = new URLSearchParams({ brand: brandName });
    setSearchParams(queryParams);
  };
  
  return (
    <div>
      <div className="row mt-4">
        {brands.map((brand, index) => (
          <div
            key={index}
            className={cx(
              "col-2 d-flex justify-content-center align-items-center mx-2 mb-4",
              "list-brand-item"
            )}
            onClick={() => handleBrandClick(brand.name)}
          >
            <img
              src={buildImageUrl(brand.imageBrand_url)} // Thay thế bằng đường dẫn phù hợp
              alt={brand}
              className={cx("image-brand-product")}
            />
          </div>
        ))}
      </div>

      <div className={cx("row mt-4", "product-list")}>
        {products.map((product) => (
          <ProductCard  key={product.id} card={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
