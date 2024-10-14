
import styles from "./Menu.module.scss";
import classNames from "classnames/bind"; //npm i classnames



const cx = classNames.bind(styles);
function Header({ title, onBack }) {
return(
    <header className={cx('header')}>
        <button className={cx('back-btn')} onClick={onBack}>
        <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h2 className={cx('header-title')} >{title}</h2>
    </header>
)
  

}

export default Header;
