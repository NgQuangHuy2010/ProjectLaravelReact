import Dropdown from "react-multilevel-dropdown";
import classNames from "classnames/bind";
import Carousel from "react-bootstrap/Carousel";
import ListGroup from "react-bootstrap/ListGroup";
import styles from "./home.module.scss";
const cx = classNames.bind(styles);
function Home() {
  const categories = [
    {
      id: 1,
      name: "Category 1",
      subitems: ["Subitem 1", "Subitem 2", "Subitem 3", "Subitem 4"],
    },
    { id: 2, name: "Category 2", subitems: ["Subitem 5", "Subitem 6"] },
    {
      id: 3,
      name: "Category 3",
      subitems: ["Subitem 7", "Subitem 8", "Subitem 9"],
    },
  ];
  const ExampleCarouselImage = ({ src, alt }) => (
    <img className="d-block w-100" src={src} alt={alt} />
  );
  return (
    <div className="mt-4">
      <div className="row">
        <div className="col-2">
          <ul className={cx("dropdown-list")}>
            {categories.map((category) => (
              <li key={category.id} style={{ display: "block" }}>
                <Dropdown.Item className={cx("dropdown-item")}>
                  <span className={cx("dropdown-name")}>{category.name}</span>
                  <span className={cx("dropdown-icon")}>
                    <i className="fa-solid fa-chevron-right"></i>
                  </span>
                  <Dropdown.Submenu position="right" className={cx("sub-menu")}>
                    <div className="container">
                      <div className="row">
                        {categories.map((category) => (
                          <div className="col-4" key={category.id}>
                            <h5 className="mb-3 text-dark">{category.name}</h5>
                            <ul className="list-unstyled">
                              {category.subitems.map((subitem, index) => (
                                <li className="text-dark" key={index}>
                                  {subitem}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Dropdown.Submenu>
                </Dropdown.Item>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-7  d-flex flex-column">
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
            <div style={{ flexGrow: 1}} className="mb-3">
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
  );
}

export default Home;
