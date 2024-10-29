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
  const priceQuery = searchParams.get("price");
  const [categoryId, setCategoryId] = useState(null); 
  //useRef lưu categoryId ngay khi component được khởi tạo.
  //Lấy categoryId từ location.state hoặc sessionStorage.
  const categoryIdRef = useRef(location.state?.categoryId|| 
  sessionStorage.getItem("categoryId"));

  useEffect(() => {
    if (categoryIdRef.current) {
      setCategoryId(categoryIdRef.current);
      // Lưu vào sessionStorage ngay khi có categoryId 
      sessionStorage.setItem("categoryId", categoryIdRef.current); 
    } else {
      console.warn("categoryId is undefined. Ensure it's passed correctly.");
    }
  }, []);

  
  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) {
        return;
      }
      try {
        const data = await getProductsByCategory(categoryId);
        const filteredProducts = filterProducts(data, brandQuery,priceQuery);
        setProducts(filteredProducts);
        setBrands(extractUniqueBrands(data));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [brandQuery, categoryId,priceQuery]);

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
  const filterProducts = (products, brand, price) => {
    // Khởi tạo biến filteredProducts với danh sách sản phẩm ban đầu
    let filteredProducts = products;
  
    // Lọc theo brand
    if (brand) {
       // Kiểm tra xem brand có giá trị hay không
    // Nếu có, lọc các sản phẩm có trong brand
      filteredProducts = filteredProducts.filter((p) => p.brand?.name === brand);
    }
  
    // Lọc theo price
    if (price) {

      // Tách min và max từ chuỗi giá
      const [minPrice, maxPrice] = price.split('-').map(Number); 
  
      filteredProducts = filteredProducts.filter((p) => {
        // Lấy giá của sản phẩm từ thuộc tính discount
        const productPrice = p.discount; 
  
        // Kiểm tra xem giá sản phẩm có nằm trong khoảng giá không
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
    }
  
    return filteredProducts;
  };
  
  

  const handleBrandClick = (brandName) => {
    const queryParams = new URLSearchParams({ brand: brandName });
    //url chỉ có brand
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
