import { Card, Col } from "react-bootstrap";
import classNames from "classnames/bind"; // Nếu bạn dùng CSS Module
import styles from "./ProductCard.module.scss"; // CSS module của bạn
import { buildImageUrl } from "~/utils/imageUtils";

const cx = classNames.bind(styles);

const ProductCard = ({ card, onClick,className }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    })
      .format(amount)
    
  };

  return (
    <Col key={card.id} xs={12} md={6} lg={3} className={`mb-3 ${className}`}>
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
            {formatCurrency(card.discount)}
          </Card.Text>
          <Card.Text className={cx("card-price")}>
            {formatCurrency(card.price_product)}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductCard;
