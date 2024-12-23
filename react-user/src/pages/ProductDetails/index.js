import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import { useParams } from "react-router-dom";
import { getProductDetails } from "~/services/ProductDetailsService";
import classNames from "classnames/bind";
import styles from "./productDetails.module.scss";
import MenuCategory from "~/components/MenuCategory/MenuCategory";
import { buildImageUrl } from "~/utils/imageUtils";
const cx = classNames.bind(styles);

function ProductDetails() {
  const [productDetails, setProductDetails] = useState({
    attributes: [], // Khởi tạo attributes dưới dạng mảng để tránh lỗi
  });
  const [galleryImages, setGalleryImages] = useState([]);
  //   const location = useLocation(); // Lấy state chứa ID
  const { id: idProduct } = useParams(); // Lấy id đổi tên thành idProduct từ URL trích xuất giá trị của tham số :id từ route
  const fetchProductDetails = async (idProduct) => {
    try {
      const data = await getProductDetails(idProduct);
      const product = data.data[0]; // Lấy sản phẩm đầu tiên từ mảng data
      setProductDetails(product); // Lưu thông tin sản phẩm
      const images = product?.images_url?.map((imageUrl) => ({
        original: buildImageUrl(imageUrl), // Sử dụng buildImageUrl để lấy URL ảnh gốc
        thumbnail: buildImageUrl(imageUrl), // Dùng ảnh gốc làm thumbnail
      }));

      setGalleryImages(images || []); // Lưu ảnh gallery
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // Gọi fetchProductDetails khi idProduct thay đổi
  useEffect(() => {
    if (idProduct) {
      fetchProductDetails(idProduct); // Gọi hàm fetch dữ liệu
    }
  }, [idProduct]);

  const tableData = [
    {
      attribute_name: "Thương hiệu",
      attribute_value: productDetails.brand?.name,
    },
    ...productDetails.attributes, // Thêm các attributes
  ];
  return (
    <>
      <div className="row ">
        <div className="col-2 p-0">
          <div className="mt-4">
            <MenuCategory open={false} />
          </div>
        </div>
      </div>
      <div className="row ">
        <div className="col-6 bg-white">
          <ImageGallery
            items={galleryImages}
            showThumbnails={true} // Hiển thị thumbnail bên dưới
            thumbnailPosition="bottom" // Điều chỉnh vị trí của thumbnail
            slideDuration={450} // Điều chỉnh thời gian chuyển đổi giữa các ảnh
            showFullscreenButton={false} // ko Hiển thị nút fullscreen
            showPlayButton={false} // Không hiển thị nút play
            showNav={false} // Ẩn các nút mũi tên
          />
        </div>
        <div className="col-6 bg-white p-5">
          <h1 className={cx("name_product")}>{productDetails.name_product}</h1>
          <div className={cx("product-prices", "py-5 ")}>
            <span className={cx("product-discount-price", "me-4")}>
              {Number(productDetails.discount).toLocaleString()}đ
            </span>
            <del className={cx("product-original-price")}>
              {Number(productDetails.price_product).toLocaleString()}đ
            </del>
          </div>

          <div className={cx(" mt-3")}>
            <button className={cx("button-buy", "btn btn-danger btn-lg me-3 ")}>
              Mua ngay
            </button>
            <button className={cx("btn btn-lg", "button-more-cart")}>
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      <div className="row mt-3 ">
        <div className="col-8 bg-white p-5 " >
          <h3 className={cx("table-title", "mb-0 text-center mb-4")}>Mô tả sản phẩm</h3>
          <div dangerouslySetInnerHTML={{ __html: productDetails.description }}  className={cx("description")}></div>

        </div>

        <div className="col-4 bg-white p-5">
          <div className={cx("table-responsive")}>
            <h3 className={cx("table-title", "mb-0")}>Thông Số Kỹ Thuật</h3>
            <table className={cx("table")}>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td className={cx("table-cell-atributes")}>
                      {item.attribute_name}
                    </td>
                    <td className={cx("table-cell-atributes-value")}>
                      {item.attribute_value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
