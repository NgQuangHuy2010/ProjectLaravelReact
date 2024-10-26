import { Card, Col } from "react-bootstrap";
import classNames from "classnames/bind"; // Nếu bạn dùng CSS Module
import styles from "./ProductCard.module.scss"; // CSS module của bạn
import { buildImageUrl } from "~/utils/imageUtils";

const cx = classNames.bind(styles);

const ProductCard = ({ card, onClick }) => {
 

  return (
    <Col key={card.id} xs={12} md={6} lg={3} className="mb-3">
      <Card className={cx("h-100", "card")} onClick={onClick}>
        <div className={cx("card-image-container")}>
          <Card.Img
            variant="top"
            src={buildImageUrl(card.image_url)}
            className="img-featured-product"
          />
        </div>
        <Card.Body className={cx("card-body")}>
          <Card.Title className={cx("card-title")}>
            {card.name_product}
          </Card.Title>
          <Card.Text className={cx("card-discount")}>
            {card.discount + "đ"}
          </Card.Text>
          <Card.Text className={cx("card-price")}>
            {card.price_product + "đ"}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductCard;
