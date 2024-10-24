import Dropdown from "react-multilevel-dropdown";
import classNames from "classnames/bind";
import Carousel from "react-bootstrap/Carousel";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Row, Col, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import styles from "./home.module.scss";
import { getCategory } from "~/services/CategoryService";
import { buildImageUrl } from "~/utils/imageUtils";
const cx = classNames.bind(styles);
function Home() {
  const [category, setCategory] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory(); // Gọi API
        //console.log("Categories:", data); // Log dữ liệu để kiểm tra
        setCategory(data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching categories:", error); // Log lỗi nếu có
      }
    };

    fetchCategories(); // Gọi hàm lấy dữ liệu
  }, []);

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

                    <span className={cx("dropdown-name")}>
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
                          {/* <div className="col-12">
                          <h5 className="text-dark">Sản phẩm nổi bật</h5>
                          <ul className="list-unstyled">
                            {categoryItem.products.map((product) => (
                              <li key={product.id}>{product.name_product}</li>
                            ))}
                          </ul>
                        </div> */}
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
              <ListGroup.Item>
                <img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/b2s-2024-right-banner-laptop.jpg"
                  alt="A scenic view of nature"
                  className="img-fluid mb-3"
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/m55-gia-moi-right-banner-30-8-2024.png"
                  alt="A scenic view of nature2"
                  className="img-fluid mb-3"
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/right-banner-14-10.jpg"
                  alt="A scenic view of nature2"
                  className="img-fluid mb-3"
                />
              </ListGroup.Item>
            </ListGroup>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Carousel
          fade
          indicators={false}
          interval={3000}
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
          {[0, 1, 2].map((slide) => (
            <Carousel.Item key={slide}>
              <Row className="">
                {[0, 1, 2, 3, 4,5,6,7].map((card) => (
                  <Col key={card} xs={12} md={6} lg={3} className="mb-3">
                    <Card className="h-100">
                      <Card.Img
                        variant="top"
                       
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                      <Card.Body>
                        <Card.Title>Card {slide * 5 + card + 1}</Card.Title>
                        <Card.Text>
                          This is the content of card {slide * 5 + card + 1}.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
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
