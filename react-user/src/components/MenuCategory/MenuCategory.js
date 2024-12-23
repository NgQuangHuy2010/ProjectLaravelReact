import { useEffect, useState } from "react";
import Dropdown from "react-multilevel-dropdown";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./MenuCategory.module.scss";
import { getCategory } from "~/services/HomeServices";
import { buildImageUrl } from "~/utils/imageUtils";
import Loader from "../Loader/Loader";
const cx = classNames.bind(styles);

const MenuCategory = ({ open }) => {
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  // Toggle mở/đóng khi hover, nhưng chỉ áp dụng khi open = false
  const toggleDropdown = () => {
    if (!open) {
      setIsOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    // Lấy danh mục từ localStorage hoặc gọi API nếu dữ liệu đã hết hạn
    const fetchCategoriesFromLocalStorageOrApi = async () => {
      setIsLoading(true); // Bật trạng thái loading khi bắt đầu gọi dữ liệu

      // Lấy dữ liệu categories từ localStorage
      const cachedCategories = localStorage.getItem("categories");

      // Lấy thời gian cập nhật danh mục từ localStorage
      const lastUpdated = localStorage.getItem("categories-last-updated");

      // Kiểm tra nếu dữ liệu tồn tại trong localStorage và chưa quá 30 giây
      if (
        cachedCategories &&
        lastUpdated &&
        Date.now() - parseInt(lastUpdated) < 60000
      ) {
        // Nếu dữ liệu trong localStorage còn mới (chưa quá 30 giây), sử dụng nó
        setCategory(JSON.parse(cachedCategories)); // Cập nhật state với dữ liệu lấy từ localStorage
      } else {
        // Nếu không có dữ liệu hoặc dữ liệu đã quá 30 giây, gọi API để lấy dữ liệu mới
        try {
          const data = await getCategory(); // Gọi API để lấy dữ liệu danh mục
          setCategory(data); // Cập nhật state với dữ liệu mới lấy từ API
          localStorage.setItem("categories", JSON.stringify(data)); // Lưu dữ liệu mới vào localStorage
          localStorage.setItem(
            "categories-last-updated",
            Date.now().toString()
          ); // Cập nhật thời gian mới nhất vào localStorage
        } catch (error) {
          console.error("Error fetching categories:", error); // Log lỗi nếu API gọi không thành công
        }
      }

      setIsLoading(false); // Tắt trạng thái loading khi hoàn thành việc lấy dữ liệu
    };

    // Gọi hàm fetchCategoriesFromLocalStorageOrApi ngay khi component mount
    fetchCategoriesFromLocalStorageOrApi();

    // Tạo một interval để tự động gọi lại API mỗi 30 giây
    const interval = setInterval(fetchCategoriesFromLocalStorageOrApi, 60000); // 30 giây

    // Cleanup: Gỡ bỏ interval khi component bị unmount
    return () => clearInterval(interval); // Dọn dẹp interval khi component không còn trên giao diện
  }, []); // useEffect chỉ chạy một lần khi component mount

  const handleCategoryClick = (
    slug,
    id,
    brand,
    price,
    attributeDefId,
    attributeId
  ) => {
    // Tạo đối tượng để lưu các tham số truy vấn
    const queryParams = new URLSearchParams();

    // Thêm categoryId vào state
    const state = { categoryId: id };

    // Nếu có brand, thêm vào queryParams
    if (brand) {
      queryParams.append("brand", encodeURIComponent(brand));
    }

    // Nếu có price, thêm vào queryParams
    if (price) {
      queryParams.append("price", price);
    }
    if (attributeDefId && attributeId) {
      queryParams.append(attributeDefId, attributeId);
    }
    //   const page = 1;  // Có thể thay đổi khi người dùng chuyển trang
    // queryParams.append("page", page);
    // Điều hướng với URL và state
    navigate(`/products/${slug}?${queryParams.toString()}`, { state });
  };

  const categoryIcons = {
    "Máy lạnh": "https://img.icons8.com/ios/30/air-conditioner.png",
    "Máy sấy tóc": "https://img.icons8.com/ios/30/hair-dryer.png",
    Tivi: "https://img.icons8.com/ios/30/tv.png",
    "Bếp hồng ngoại": "https://img.icons8.com/ios/30/electric-stovetop.png",
    "Tủ lạnh": "https://img.icons8.com/ios/30/fridge.png",
    "Máy giặt": "https://img.icons8.com/ios/30/washing-machine.png",
    Loa: "https://img.icons8.com/ios/30/room-sound.png",
    "Nồi cơm điện": "https://img.icons8.com/ios/30/cooker.png",
    "Máy nước nóng": "https://img.icons8.com/ios/30/water-heater.png",
    "Quạt điện": "https://img.icons8.com/ios/30/fan.png",
    "Máy lọc nước": "https://img.icons8.com/ios/30/ice-maker.png",
  };
  const error = console.error;
  console.error = (...args) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };
  return (
    <>
      {isLoading && <Loader />}

      <div
        className={cx("dropdown-container")}
        onMouseEnter={!open ? toggleDropdown : null}
        onMouseLeave={!open ? toggleDropdown : null}
      >
        <div
          className={cx(
            "d-flex justify-content-center align-items-center",
            "title-menu-category"
          )}
        >
          <h4 className="py-3 m-0">
            <i className="fa-solid fa-list"></i>&nbsp;Danh mục sản phẩm
          </h4>
        </div>
        <ul
          className={cx("dropdown-list")}
          style={{ display: isOpen ? "block" : "none" }}
        >
          {category.map((categoryItem) => (
            <span key={categoryItem.id} style={{ display: "block" }}>
              <Dropdown.Item className={cx("dropdown-item")}>
                <span className={cx("dropdown-icon-house")}>
                  <img
                    src={categoryIcons[categoryItem.name]}
                    alt={categoryItem.name}
                  />
                </span>

                <span
                  className={cx("dropdown-name")}
                  onClick={() =>
                    handleCategoryClick(categoryItem.slug, categoryItem.id)
                  }
                >
                  {categoryItem.name}
                </span>
                <span className={cx("dropdown-icon")}>
                  <i className="fa-solid fa-chevron-right"></i>
                </span>

                <Dropdown.Submenu position="right" className={cx("sub-menu")}>
                  <div className="container">
                    <div className="row">
                      <div className="col-12">
                        <h5 className="text-dark fw-bold">
                          Chọn theo thương hiệu
                        </h5>
                        <ul className="list-unstyled d-flex  py-4">
                          {categoryItem.products
                            .reduce((acc, product) => {
                              // Kiểm tra xem brand đã có trong acc chưa
                              if (
                                product.brand &&
                                !acc.some(
                                  (item) => item.brand.id === product.brand.id
                                )
                              ) {
                                acc.push(product); // Nếu chưa có, thêm sản phẩm vào acc
                              }
                              return acc; // Trả về mảng đã lọc
                            }, [])
                            .map((product) => (
                              <div
                                onClick={() =>
                                  handleCategoryClick(
                                    categoryItem.slug,
                                    categoryItem.id,
                                    product.brand.name
                                  )
                                }
                                key={product.brand.id}
                                className={cx("image-parent-brand", "me-3")}
                              >
                                <img
                                  className={cx("image-brand")}
                                  src={buildImageUrl(
                                    product.brand.imageBrand_url
                                  )}
                                  alt={product.brand.name}
                                />
                              </div>
                            ))}
                        </ul>
                      </div>
                      <div className="col-12">
                        <h5 className="text-dark fw-bold">Giá bán</h5>
                        <ul className="list-unstyled py-4">
                          {/* {categoryItem.products.map((product) => (
                          <li key={product.id}>{product.name_product}</li>
                        ))} */}
                          <li className={cx("parent-price-product")}>
                            <div
                              className={cx("sort-price-product")}
                              onClick={() =>
                                handleCategoryClick(
                                  categoryItem.slug,
                                  categoryItem.id,
                                  null,
                                  "0-10000000"
                                )
                              }
                            >
                              Dưới 10 triệu
                            </div>
                            <div
                              className={cx("sort-price-product")}
                              onClick={() =>
                                handleCategoryClick(
                                  categoryItem.slug,
                                  categoryItem.id,
                                  null,
                                  "10000000-15000000"
                                )
                              }
                            >
                              Từ 10 - 15 triệu
                            </div>
                            <div
                              className={cx("sort-price-product")}
                              onClick={() =>
                                handleCategoryClick(
                                  categoryItem.slug,
                                  categoryItem.id,
                                  null,
                                  "15000000-20000000"
                                )
                              }
                            >
                              Từ 15 - 20 triệu
                            </div>
                            <div
                              className={cx("sort-price-product")}
                              onClick={() =>
                                handleCategoryClick(
                                  categoryItem.slug,
                                  categoryItem.id,
                                  null,
                                  "20000000-25000000"
                                )
                              }
                            >
                              Từ 20 - 25 triệu
                            </div>
                            <div
                              className={cx("sort-price-product")}
                              onClick={() =>
                                handleCategoryClick(
                                  categoryItem.slug,
                                  categoryItem.id,
                                  null,
                                  "25000000-99999999"
                                )
                              }
                            >
                              Trên 25 triệu
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div
                        className={cx("col-12 d-flex mt-2", "menu-attributes")}
                      >
                        {Object.entries(
                          categoryItem.products.reduce((acc, product) => {
                            // Duyệt qua từng attribute của product
                            product.attributes.forEach((attribute) => {
                              const { attribute_name, attribute_value } =
                                attribute;

                              // Nếu chưa có `attribute_name`, tạo một Map mới
                              if (!acc[attribute_name]) {
                                acc[attribute_name] = new Map();
                              }

                              // Thêm attribute vào Map nếu chưa có `attribute_value` giống nhau
                              if (!acc[attribute_name].has(attribute_value)) {
                                acc[attribute_name].set(
                                  attribute_value,
                                  attribute
                                );
                              }
                            });
                            return acc;
                          }, {})
                        ).map(([name, valuesMap]) => (
                          <div key={name} className="d-flex flex-column">
                            <h5 className="fw-bold text-dark pb-3">{name}</h5>
                            <ul className="list-unstyled">
                              {/* Lấy các giá trị duy nhất từ Map (dùng values) */}
                              {[...valuesMap.values()].map(
                                (attribute, index) => (
                                  <li
                                    key={index}
                                    className={cx("menu-attributes-value")}
                                    onClick={() =>
                                      handleCategoryClick(
                                        categoryItem.slug,
                                        categoryItem.id,
                                        null,
                                        null,
                                        attribute.attribute_definition_id,
                                        attribute.attribute_value_slug
                                      )
                                    }
                                  >
                                    <i className="fa-solid fa-caret-right"></i>
                                    {attribute.attribute_value}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Dropdown.Submenu>
              </Dropdown.Item>
            </span>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MenuCategory;
