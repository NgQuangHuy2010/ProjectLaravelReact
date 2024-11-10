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
  const [selectedAttributes, setSelectedAttributes] = useState(attributes);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedPriceSort, setSelectedPriceSort] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

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

    return attributes.map((attribute) => {
      // Sử dụng Set để lọc các giá trị trùng lặp của attribute_value
      const uniqueValues = Array.from(
        new Set(
          attribute.product_attributes.map((attr) => attr.attribute_value)
        )
      );

      // Trả về đối tượng với tên thuộc tính và giá trị duy nhất
      return {
        attribute_name: attribute.attribute_name,
        values: uniqueValues.map((value) => ({
          attribute_value: value,
          attribute_definition_id: attribute.product_attributes.find(
            (attr) => attr.attribute_value === value
          ).attribute_definition_id,
        })),
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
    const queryParams = new URLSearchParams(location.search);
    //khi trang được tải lại, giá trị đó sẽ được thiết lập lại vào trạng thái
    // giao diện sẽ hiển thị đúng khoảng giá mà user đang chọn, tránh việc bị mất cái lựa chọn hiện tại khi f5
    // Cập nhật giá trị vào state
    // Cập nhật giá trị bộ lọc từ URL
    setSelectedPriceRange(queryParams.get("price") || null);
    setSelectedPriceSort(queryParams.get("sort") || null);

    // Lấy thuộc tính (loại bỏ các tham số không liên quan)
    const attributes = Object.fromEntries(
      [...queryParams].filter(
        ([key]) => !["brand", "price", "sort"].includes(key)
      )
    );
    setSelectedAttributes(attributes);
  }, [location.search]);

  const handlePriceSort = (sort) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("sort", sort);
    setSearchParams(queryParams);
    setSortOrder(sort);
    setSelectedPriceSort(sort);
  };
  const handleAttributesClick = (attributeDefinitionId, attributeValue) => {
    const currentParams = new URLSearchParams(window.location.search);

    // Lấy giá trị hiện tại và chuyển đổi chúng thành Set
    const currentValues = new Set(
      currentParams.get(attributeDefinitionId)?.split(",") || []
    );

    // Thêm hoặc xóa giá trị trong Set dựa trên tình trạng đã chọn
    if (currentValues.has(attributeValue)) {
      currentValues.delete(attributeValue);
    } else {
      currentValues.add(attributeValue);
    }
    // Nếu không có giá trị nào trong Set thì xóa khỏi URL
    if (currentValues.size === 0) {
      currentParams.delete(attributeDefinitionId);
    } else {
      // Cập nhật lại giá trị trong URL
      currentParams.set(
        attributeDefinitionId,
        Array.from(currentValues).join(",")
      );
    }
    // Cập nhật lại URL với các tham số đã thay đổi
    setSearchParams(currentParams);
  };

  const priceRanges = [
    { label: "Dưới 10 triệu", value: "0-10000000" },
    { label: "10 đến 15 triệu", value: "10000000-15000000" },
    { label: "15 đến 20 triệu", value: "15000000-20000000" },
    { label: "20 đến 25 triệu", value: "20000000-25000000" },
    { label: "Trên 25 triệu", value: "25000000-99999999" },
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
              {brands &&
                brands.map((brand, index) => (
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
                          checked={
                            selectedAttributes[value.attribute_definition_id]
                              ?.split(",")
                              .includes(value.attribute_value) || false
                          }
                          onChange={() =>
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
