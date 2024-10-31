import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import Carousel from "react-bootstrap/Carousel";
import ListGroup from "react-bootstrap/ListGroup";
import { Row } from "react-bootstrap";
import styles from "./home.module.scss";
import { getFeaturedProduct } from "~/services/HomeServices";
import ProductCard from "~/components/ProductCard/ProductCard";
import MenuCategory from "~/components/MenuCategory/MenuCategory";
const cx = classNames.bind(styles);
function Home() {
  const [featuredProduct, setFeaturedProduct] = useState([]);
  
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

  const slides = [];
  for (let i = 0; i < featuredProduct.length; i += 10) {
    slides.push(featuredProduct.slice(i, i + 10)); // Chia thành các nhóm 8 card cho mỗi slide
  }

  const ExampleCarouselImage = ({ src, alt }) => (
    <img className="d-block w-100" src={src} alt={alt} />
  );

  return (
    <>
      <div className="mt-4">
        <div className="row">
         <div className="col-2">
         <MenuCategory  open={true}/>
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
