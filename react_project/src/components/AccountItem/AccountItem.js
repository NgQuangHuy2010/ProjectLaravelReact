import classNames from "classnames/bind"; //npm i classnames
import { Link } from "react-router-dom";
import styles from "./AccountItem.module.scss";
const cx = classNames.bind(styles);

function AccountItem({data}) {
  return (

    <Link to={`/@${data.nickname}`} className={cx("wrapper")}>
      <img
        className={cx("avatar")}
        src={data.avatar}
        alt={data.full_name}
      />

      <div className={cx("info")}>
        <h4 className={"name"}>
          <span className={cx("name-account")}>{data.full_name}</span>
         {data.tick &&  <i
            className={cx("fa-solid fa-circle-check")}
            style={{ color: "#74C0FC" }}
          ></i>}
        </h4>
        <span className={cx("username")}>{data.nickname}</span>
      </div>
    </Link>

  );
}

export default AccountItem;
