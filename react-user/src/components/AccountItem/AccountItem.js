import classNames from "classnames/bind"; //npm i classnames
import { Link } from "react-router-dom";
import { buildImageUrl } from "~/utils/imageUtils";
import styles from "./AccountItem.module.scss";
const cx = classNames.bind(styles);

function AccountItem({data}) {
  return (

    <Link to={`/@${data.nickname}`} className={cx("wrapper")}>
      <img
        className={cx("avatar")}
        src={buildImageUrl(data.image_url)}
        alt={data.name_product}
      />

      <div className={cx("info")}>
        <h4 className={"name"}>
          <span className={cx("name-account")}>{data.name_product}</span>
         {data.tick &&  <i
            className={cx("fa-solid fa-circle-check")}
            style={{ color: "#74C0FC" }}
          ></i>}
        </h4>
      </div>
    </Link>

  );
}

export default AccountItem;
