import { useEffect, useState } from "react";
import Dropdown from "react-multilevel-dropdown";
import classNames from "classnames/bind";
import Carousel from "react-bootstrap/Carousel";
import ListGroup from "react-bootstrap/ListGroup";

import { Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import styles from "./home.module.scss";
import { getCategory, getFeaturedProduct } from "~/services/HomeServices";
import { buildImageUrl } from "~/utils/imageUtils";
import ProductCard from "~/components/ProductCard/ProductCard";
const cx = classNames.bind(styles);
function Home() {
  const [category, setCategory] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory();

        setCategory(data);
      } catch (error) {
        console.error("Error fetching :", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchfeaturedProduct = async () => {
      try {
        const data = await getFeaturedProduct();

        setFeaturedProduct(data);
      } catch (error) {
        console.error("Error fetching :", error);
      }
    };

    fetchfeaturedProduct();
  }, []);
  const handleCategoryClick = (slug, id, brand,price,sort) => {
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
    // Điều hướng với URL và state
    navigate(`/products/${slug}?${queryParams.toString()}`, { state });
  };

  const slides = [];
  for (let i = 0; i < featuredProduct.length; i += 10) {
    slides.push(featuredProduct.slice(i, i + 10)); // Chia thành các nhóm 8 card cho mỗi slide
  }

  const ExampleCarouselImage = ({ src, alt }) => (
    <img className="d-block w-100" src={src} alt={alt} />
  );
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

  return (
    <>
      <div className="mt-4">
        <div className="row">
          <div className="col-2">
            <ul className={cx("dropdown-list")}>
              {category.map((categoryItem) => (
                <li key={categoryItem.id} style={{ display: "block" }}>
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

                    <Dropdown.Submenu
                      position="right"
                      className={cx("sub-menu")}
                    >
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="text-dark fw-bold">
                              Chọn theo thương hiệu
                            </h5>
                            <ul className="list-unstyled d-flex py-4">
                              {categoryItem.products
                                .reduce((acc, product) => {
                                  // Kiểm tra xem brand đã có trong acc chưa
                                  if (
                                    product.brand &&
                                    !acc.some(
                                      (item) =>
                                        item.brand.id === product.brand.id
                                    )
                                  ) {
                                    acc.push(product); // Nếu chưa có, thêm sản phẩm vào acc
                                  }
                                  return acc; // Trả về mảng đã lọc
                                }, [])
                                .map((product) => (
                                  <li
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
                                  </li>
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
                                <div className={cx("sort-price-product")}  onClick={() => handleCategoryClick(categoryItem.slug, categoryItem.id, null, "0-10000000")}> 
                                  Dưới 10 triệu
                                </div>
                                <div className={cx("sort-price-product")} onClick={() => handleCategoryClick(categoryItem.slug, categoryItem.id, null, "10000000-15000000")}>
                                  Từ 10 - 15 triệu
                                </div>
                                <div className={cx("sort-price-product")} onClick={() => handleCategoryClick(categoryItem.slug, categoryItem.id, null, "15000000-20000000")}>
                                  Từ 15 - 20 triệu
                                </div>
                                <div className={cx("sort-price-product")} onClick={() => handleCategoryClick(categoryItem.slug, categoryItem.id, null, "20000000-25000000")}>
                                  Từ 20 - 25 triệu
                                </div>
                                <div className={cx("sort-price-product")} onClick={() => handleCategoryClick(categoryItem.slug, categoryItem.id, null, "25000000-99999999")}>
                                  Trên 25 triệu
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Dropdown.Submenu>
                  </Dropdown.Item>
                </li>
              ))}
            </ul>
          </div>

          <div className={cx("col-7  d-flex flex-column")}>
            <>
              <Carousel
                fade
                indicators={false}
                interval={3000}
                prevIcon={
                  <span>
                    <i
                      className={cx(
                        "fa-solid fa-circle-chevron-left",
                        "arrow-icon-carousels"
                      )}
                    ></i>
                  </span>
                }
                nextIcon={
                  <span>
                    <i
                      className={cx(
                        "fa-solid fa-circle-chevron-right",
                        "arrow-icon-carousels"
                      )}
                    ></i>
                  </span>
                }
              >
                <Carousel.Item>
                  <ExampleCarouselImage
                    src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/tai-nghe-sony-wf-c510-home.jpg"
                    alt="First slide"
                  />
                  {/* <Carousel.Caption>
                  <h3>First slide label</h3>
                  <p>
                    Nulla vitae elit libero, a pharetra augue mollis interdum.
                  </p>
                </Carousel.Caption> */}
                </Carousel.Item>

                <Carousel.Item>
                  <ExampleCarouselImage
                    src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/T%E1%BA%B7ng%20b%E1%BA%A3o%20h%C3%A0nh%2012%20th%C3%A1ng%20Vip.png"
                    alt="Second slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <ExampleCarouselImage
                    src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/vivo-y100-home.png"
                    alt="Third slide"
                  />
                </Carousel.Item>
              </Carousel>
              <div className={cx("gif-bottom")}>
                <img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:1200:75/q:90/plain/https://dashboard.cellphones.com.vn/storage/b2s-update-19-06%20(1).gif"
                  alt="A scenic view of nature"
                  className="img-fluid h-100 mb-3"
                />
              </div>
            </>
          </div>

          <div className="col-3">
            <ListGroup className="border-0">
              <ListGroup.Item className="mb-4">
                <img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/b2s-2024-right-banner-laptop.jpg"
                  alt="A scenic view of nature"
                  className="img-fluid "
                />
              </ListGroup.Item>
              <ListGroup.Item className="mb-4">
                <img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/m55-gia-moi-right-banner-30-8-2024.png"
                  alt="A scenic view of nature2"
                  className="img-fluid "
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/right-banner-14-10.jpg"
                  alt="A scenic view of nature2"
                  className="img-fluid "
                />
              </ListGroup.Item>
            </ListGroup>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <img
          src="https://cdn.nguyenkimmall.com/images/companies/_1/MKT_ECM/0724/Title-1200x65.jpg"
          alt="banner"
          className={cx("image-title")}
        />
        <Carousel
          fade
          indicators={false}
          interval={null}
          prevIcon={
            <span>
              <i
                className={cx(
                  "fa-solid fa-circle-chevron-left ",
                  "arrow-icon-carousels"
                )}
              ></i>
            </span>
          }
          nextIcon={
            <span>
              <i
                className={cx(
                  "fa-solid fa-circle-chevron-right",
                  "arrow-icon-carousels"
                )}
              ></i>
            </span>
          }
        >
          {slides.map((productCard, slideIndex) => (
            <Carousel.Item key={slideIndex}>
              <Row className="justify-content-center">
                {productCard.map((card) => (
                  <ProductCard key={card.id} card={card} />
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </>
  );
}

export default Home;
