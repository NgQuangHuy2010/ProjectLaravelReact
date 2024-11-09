import { useCallback, useEffect, useMemo, useState } from "react";
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
  //console.log("attributes ở page product", attributes);

  const filterProducts = useCallback((products, brand, price, attributes) => {
    let filteredProducts = products;

    if (brand) filteredProducts = filterByBrand(filteredProducts, brand);
    if (price) filteredProducts = filterByPrice(filteredProducts, price);
    if (attributes && Object.keys(attributes).length > 0) {
      filteredProducts = filterByAttributes(filteredProducts, attributes);
    }

    return filteredProducts;
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) {
        return;
      }
      try {
        //chỉ dùng tham số cateId và sort tương ứng từ hàm getProductsByCategory(file productService) theo thứ tự , nếu ko dùng tham số khác để null
        const data = await getProductsByCategory( categoryId,  null, null, sortOrder, null  );
        const filteredProducts = filterProducts( data, brandQuery, priceQuery,attributes );
        setProducts(filteredProducts);
        setBrands(extractUniqueBrands(data));
        setAttributesProduct(extractUniqueAttributeProduct(data));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [
    categoryId,
    sortOrder,
    brandQuery,
    priceQuery,
    location,
    attributes,
    filterProducts,
  ]); // thêm location để khi url thay đổi nó sẽ render lại khi chọn vào danh mục đang ở product

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
  const extractUniqueAttributeProduct = (products) => {
    return Object.entries(
      products.reduce((acc, product) => {
        product.attributes.forEach((attribute) => {
          const { attribute_name, attribute_value } = attribute;

          // Nếu chưa có attribute_name trong acc, tạo mới Map
          if (!acc[attribute_name]) {
            acc[attribute_name] = new Map();
          }

          // Nếu chưa có attribute_value trong Map của attribute_name, thêm vào
          if (!acc[attribute_name].has(attribute_value)) {
            acc[attribute_name].set(attribute_value, attribute);
          }
        });
        return acc;
      }, {})
    ).map(([name, valuesMap]) => ({
      attribute_name: name,
      values: [...valuesMap.values()],
    }));
  };

  const filterByBrand = (products, brand) => {
    // Sử dụng phương thức filter để lọc ra các sản phẩm có tên brand trùng với brand được truyền vào.
    // Phương thức filter sẽ lặp qua tất cả các sản phẩm trong mảng products.
    // Kiểm tra nếu sản phẩm p có brand và tên brand của sản phẩm trùng với tên brand được truyền vào hàm.
    // Sử dụng optional chaining (?.) để tránh lỗi nếu thuộc tính brand không tồn tại trên sản phẩm.
    return products.filter((p) => p.brand?.name === brand);
  };

  // Lọc theo price
  const filterByPrice = (products, price) => {
    // Chia giá trị price thành 2 phần: minPrice và maxPrice. Dữ liệu price được truyền dưới dạng chuỗi có định dạng "minPrice-maxPrice".
    const [minPrice, maxPrice] = price.split("-").map(Number); // Hàm split cắt chuỗi tại dấu "-" và map để chuyển đổi thành số.
    // Sau khi có minPrice và maxPrice, sử dụng filter để lọc các sản phẩm trong dải giá này.
    return products.filter((p) => {
      const productPrice = p.discount; // Lấy giá  của sản phẩm
      return productPrice >= minPrice && productPrice <= maxPrice; // Kiểm tra xem giá sản phẩm có nằm trong phạm vi từ minPrice đến maxPrice
    });
  };

  // // Lọc theo attributes
  const filterByAttributes = (products, attributes) => {
    // Sử dụng filter để lọc các sản phẩm trong mảng products.
    return products.filter((product) => {
      // Đảm bảo rằng tất cả các thuộc tính trong attributes đều khớp với thuộc tính của sản phẩm.
      // Object.entries(attributes) trả về một mảng các cặp [key, value] từ đối tượng attributes.
      // sử dụng every để đảm bảo rằng tất cả các điều kiện trong attributes đều được thỏa mãn
      return Object.entries(attributes).every(
        ([attributeDefId, attributeValue]) => {
          // Sử dụng some để kiểm tra nếu sản phẩm có bất kỳ thuộc tính nào có `attribute_definition_id` và `attribute_value` khớp với giá trị của attributeDefId và attributeValue.
          // Lặp qua tất cả các thuộc tính của sản phẩm để tìm một thuộc tính phù hợp.
          const valuesArray = attributeValue.split(",");
          return product.attributes.some(
            (attr) =>
              // Kiểm tra nếu ID định nghĩa thuộc tính của sản phẩm bằng với ID của thuộc tính trong URL và giá trị thuộc tính khớp với giá trị từ URL
              attr.attribute_definition_id === parseInt(attributeDefId) && // parseInt để chuyển ID từ chuỗi thành số nguyên
              valuesArray.includes(attr.attribute_value)
          );
        }
      );
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
  const priceRanges = [
    { label: "Dưới 10 triệu", value: "0-10000000" },
    { label: "10 đến 15 triệu", value: "10000000-15000000" },
    { label: "15 đến 20 triệu", value: "15000000-20000000" },
    { label: "20 đến 25 triệu", value: "20000000-25000000" },
    { label: "Trên 25 triệu", value: "25000000-100000000" },
  ];

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
              {brands.map((brand, index) => (
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
