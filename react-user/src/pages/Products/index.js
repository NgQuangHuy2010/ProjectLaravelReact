import { useEffect, useState, useRef } from "react";
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
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  //useRef lưu categoryId ngay khi component được khởi tạo.
  //Lấy categoryId từ location.state hoặc sessionStorage.
  const categoryIdRef = useRef(
    location.state?.categoryId || sessionStorage.getItem("categoryId")
  );

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
        const filteredProducts = filterProducts(data, brandQuery, priceQuery);
        setProducts(filteredProducts);
        setBrands(extractUniqueBrands(data));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [brandQuery, categoryId, priceQuery]);

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
      filteredProducts = filteredProducts.filter(
        (p) => p.brand?.name === brand
      );
    }

    // Lọc theo price
    if (price) {
      // Tách min và max từ chuỗi giá
      const [minPrice, maxPrice] = price.split("-").map(Number);

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
    setSelectedPriceRange('');
  };
  
  const handlePriceRange = (priceRange) => {
    // Lấy các tham số hiện có trên URL
    const queryParams = new URLSearchParams(window.location.search);
    // Cập nhật giá trị của price
    queryParams.set('price', priceRange);
    // Cập nhật lại URL với cả price và các tham số khác nếu có
    setSearchParams(queryParams);
    setSelectedPriceRange(priceRange);
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const price = queryParams.get('price'); // Lấy giá trị price từ URL
    if (price) {
        setSelectedPriceRange(price); // Cập nhật giá trị vào state
    }
}, [location.search]); // Chạy khi URL thay đổi
  const priceRanges = [
    { label: 'Dưới 10 triệu', value: '0-10000000' },
    { label: '10 - 15 triệu', value: '10000000-15000000' },
    { label: '15 - 20 triệu', value: '15000000-20000000' },
    { label: '20 - 25 triệu', value: '20000000-25000000' },
    { label: 'Trên 25 triệu', value: '25000000-100000000' },
  ];
  return (
    <div className={cx("bg-white","body-page-product")}>


  <div className="row mt-4 p-4">
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
          src={buildImageUrl(brand.imageBrand_url)}
          alt={brand.name} // Thay thế cho alt hợp lệ
          className={cx("image-brand-product")}
        />
      </div>
    ))}
  </div>


  <div className="row px-4 py-2">
    <ul className="list-unstyled">
        <li className={cx("parent-sort-price-product")}>
            <h4>Mức giá</h4>
            {priceRanges.map((range) => (
                <div
                    key={range.value}
                    className={cx("sort-price-product",{ active: selectedPriceRange === range.value })}
                    onClick={() => handlePriceRange(range.value)}
                >
                    {range.label}
                </div>
            ))}
        </li>
    </ul>
</div>
      <div className="p-4">
          <ul className={cx("list-unstyled d-flex","sort-order")} >
            <li className={cx('order')}>Giá thấp - cao </li>
            <li className={cx('order')}>Giá cao - thấp </li>
          </ul>
      <div className={cx("row mt-5", "product-list")}>
        {products.map((product) => (
          <ProductCard key={product.id} card={product} />
        ))}
      </div>
      </div>
    </div>
  );
}

export default Products;
