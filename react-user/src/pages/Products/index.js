import { useEffect, useMemo, useState } from "react";
import { getProductsByCategory } from "~/services/productServices";
import { useLocation, useSearchParams } from "react-router-dom";
import ProductCard from "~/components/ProductCard/ProductCard";
import classNames from "classnames/bind";
import styles from "./product.module.scss";
import { buildImageUrl } from "~/utils/imageUtils";
import MenuCategory from "~/components/MenuCategory/MenuCategory";

const cx = classNames.bind(styles);

function Products() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [attributesProduct, setAttributesProduct] = useState([]);
  const location = useLocation(); // Lấy state chứa ID
  const [searchParams, setSearchParams] = useSearchParams();
  const brandQuery = searchParams.get("brand");
  const priceQuery = searchParams.get("price");
  const attributes = useMemo(() => {
    // Lấy tất cả các tham số truy vấn (bao gồm attributes) từ URL
    const allParams = Object.fromEntries(searchParams.entries());
    //  Tạo bản sao của đối tượng allParams, chỉ giữ lại các tham số thuộc về attributes.
    const filteredAttributes = { ...allParams };
    //Loại bỏ các tham số không thuộc về attributes để ko bị lỗi khi sắp xếp hay sort theo thuộc tính khác
    delete filteredAttributes.brand;
    delete filteredAttributes.price;
    delete filteredAttributes.sort;

    return filteredAttributes;
  }, [searchParams]); // Chỉ tính toán lại khi searchParams thay đổi
  const [categoryId, setCategoryId] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedPriceSort, setSelectedPriceSort] = useState("");
  const [sortOrder, setSortOrder] = useState(null);

  // lưu categoryId ngay khi component được khởi tạo.
  //Lấy categoryId từ location.state hoặc sessionStorage.
  useEffect(() => {
    const initialCategoryId =
      location.state?.categoryId || sessionStorage.getItem("categoryId");
    if (initialCategoryId) {
      setCategoryId(initialCategoryId);
      sessionStorage.setItem("categoryId", initialCategoryId);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) {
        return;
      }
      try {
        //chỉ dùng tham số cateId và sort tương ứng từ hàm getProductsByCategory(file productService) theo thứ tự , nếu ko dùng tham số khác để null
        const data = await getProductsByCategory(
          categoryId,
          brandQuery,
          priceQuery,
          sortOrder,
          attributes
        );
       // console.log("a",data);
        
        setProducts(data.data);
        setBrands(extractUniqueBrands(data.brands));
        setAttributesProduct(extractUniqueAttributeProduct(data.attributes));
      
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [categoryId, sortOrder, brandQuery, priceQuery, location, attributes]); // thêm location để khi url thay đổi nó sẽ render lại khi chọn vào danh mục đang ở product

  const extractUniqueBrands = (brands) => {
    // Kiểm tra nếu brands là một mảng hợp lệ
    if (!Array.isArray(brands)) {
      return [];
    }
  
    // Sử dụng Map để loại bỏ trùng lặp và trả về tên và URL ảnh thương hiệu
    return Array.from(
      brands.reduce((map, brand) => {
        if (brand && brand.name && brand.imageBrand_url) {
          map.set(brand.name, { imageBrand_url: brand.imageBrand_url });
        }
        return map;
      }, new Map())
    ).map(([name, { imageBrand_url }]) => ({ name, imageBrand_url }));
  };
  
  const extractUniqueAttributeProduct = (attributes) => {
    if (!Array.isArray(attributes)) {
      return [];
    }
  
    return attributes.map(attribute => {
      // Sử dụng Set để lọc các giá trị trùng lặp của attribute_value
      const uniqueValues = Array.from(
        new Set(attribute.product_attributes.map(attr => attr.attribute_value))
      );
  
      // Trả về đối tượng với tên thuộc tính và giá trị duy nhất
      return {
        attribute_name: attribute.attribute_name,
        values: uniqueValues.map(value => ({
          attribute_value: value,
          attribute_definition_id: attribute.product_attributes.find(attr => attr.attribute_value === value).attribute_definition_id
        }))
      };
    });
  };
  
  

  const handleBrandClick = (brandName) => {
    const queryParams = new URLSearchParams({ brand: brandName });
    //url chỉ có brand
    setSearchParams(queryParams);
    setSelectedPriceRange("");
  };

  const handlePriceRange = (priceRange) => {
    // Lấy các tham số hiện có trên URL
    const queryParams = new URLSearchParams(window.location.search);
    // Cập nhật giá trị của price
    queryParams.set("price", priceRange);
    // Cập nhật lại URL với cả price và các tham số khác nếu có
    setSearchParams(queryParams);
    setSelectedPriceRange(priceRange);
  };
  useEffect(() => {
    //lấy tham số truy vấn từ url hiện tại
    const queryParams = new URLSearchParams(location.search);
    // Lấy giá trị price từ URL
    const price = queryParams.get("price");
    const sort = queryParams.get("sort");

    if (price) {
      //khi trang được tải lại, giá trị đó sẽ được thiết lập lại vào trạng thái
      // giao diện sẽ hiển thị đúng khoảng giá mà user đang chọn, tránh việc bị mất cái lựa chọn hiện tại khi f5
      // Cập nhật giá trị vào state
      setSelectedPriceRange(price);
    }
    if (sort) {
      setSelectedPriceSort(sort);
    }
  }, [location.search]); // Chạy khi URL thay đổi
  
  const handlePriceSort = (sort) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("sort", sort);
    setSearchParams(queryParams);
    setSortOrder(sort);
    setSelectedPriceSort(sort);
  };
  const handleAttributesClick = (attributeDefinitionId, attributeValue) => {
    //console.log(attributeDefinitionId, attributeValue);
    const currentParams = new URLSearchParams(window.location.search);
    
    // Lấy giá trị đã chọn cho attributeDefinitionId hiện tại
    const currentValues = currentParams.get(attributeDefinitionId);
    
    // Nếu đã có các giá trị, tách chúng thành mảng
    let updatedValues = currentValues ? currentValues.split(",") : [];
    
    // Nếu giá trị chưa có trong mảng, thêm vào, nếu đã có thì xóa đi
    if (updatedValues.includes(attributeValue)) {
      updatedValues = updatedValues.filter((value) => value !== attributeValue); // Bỏ chọn
    } else {
      updatedValues.push(attributeValue); // Thêm vào
    }
    
    if (updatedValues.length === 0) {
      currentParams.delete(attributeDefinitionId);
    } else {
      // Cập nhật lại giá trị cho attributeDefinitionId trong URL
      currentParams.set(attributeDefinitionId, updatedValues.join(","));
    }
    
    setSearchParams(currentParams);
  };
  



  const priceRanges = [
    { label: "Dưới 10 triệu", value: "0-10000000" },
    { label: "10 đến 15 triệu", value: "10000000-15000000" },
    { label: "15 đến 20 triệu", value: "15000000-20000000" },
    { label: "20 đến 25 triệu", value: "20000000-25000000" },
    { label: "Trên 25 triệu", value: "25000000-100000000" },
  ];
  return (
    <div className={cx("body-page-product")}>
      <div className="row">
        <div className="col-2 p-0">
          <div className="mt-4">
            <MenuCategory open={false} />
          </div>
        </div>
      </div>

      <div className={cx("row gap-4")}>
        <div className="col-2 bg-white">
          <div className={cx("row  p-4")}>
            <h4 className="mb-4">Thương hiệu</h4>
            <div className={cx("d-grid gap-2  w-100", "parent-list-brand")}>
              {brands && brands.map((brand, index) => (
        <div
        key={index}
        className={cx(
          "d-flex justify-content-center align-items-center",
          "list-brand-item"
        )}
        onClick={() => handleBrandClick(brand.name)}
      >
        <img
          src={buildImageUrl(brand.imageBrand_url)}
          alt={brand.name}
          className={cx("image-brand-product")}
        />
      </div>
              ))}
            </div>
          </div>

          <div className="row px-4 py-2">
            <ul className="list-unstyled ">
              <li className={cx("parent-sort-price-product")}>
                <h4 className="mb-4">Mức giá</h4>
                {priceRanges.map((range) => (
                  <div
                    key={range.value}
                    className={cx("sort-price-product", {
                      active: selectedPriceRange === range.value,
                    })}
                    onClick={() => handlePriceRange(range.value)}
                  >
                    {range.label}
                  </div>
                ))}
              </li>
            </ul>
          </div>

          <div className="row px-4 py-2">
            <ul className="list-unstyled ">
              {attributesProduct.map((attribute, index) => (
                <div key={index}>
                  <h4 className="my-4">{attribute.attribute_name}</h4>
                  <ul className="p-0">
                    {attribute.values.map((value, idx) => (
                      <li
                        key={idx}
                        className={cx(
                          "list-unstyled pb-3",
                          "list-check-attributes"
                        )}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={value.attribute_value}
                          onClick={() =>
                            handleAttributesClick(
                              value.attribute_definition_id,
                              value.attribute_value
                            )
                          }
                          // onChange={() => handleCheckboxChange(value.attribute_value)} // Xử lý thay đổi khi checkbox được chọn
                        />
                        <span className="ps-4">{value.attribute_value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-9 bg-white">
          <div className="p-4">
            <ul className={cx("list-unstyled d-flex", "sort-order")}>
              <li
                className={cx("order", {
                  active: selectedPriceSort === "asc",
                })}
                onClick={() => handlePriceSort("asc")}
              >
                Giá thấp -&gt; cao
              </li>
              <li
                className={cx("order", {
                  active: selectedPriceSort === "desc",
                })}
                onClick={() => handlePriceSort("desc")}
              >
                Giá cao -&gt; thấp
              </li>
            </ul>
            <div className={cx("row mt-5", "product-list")}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  card={product}
                  className={cx("card-product-page")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
