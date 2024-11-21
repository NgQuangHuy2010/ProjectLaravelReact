import Header from "./Header/LayoutHeader";
//import Sidebar from "./Sidebar/LayoutSidebar";
import styles from './DefaultLayout.module.scss'
import classNames from "classnames/bind";
import Footer from "./Footer/Footer";
const cx = classNames.bind(styles);
function DefaultLayout({ children }) {
  return (
    <div className={cx('wrapper')}>
      <Header />
      <div className={cx('container')}>
        {/* <Sidebar /> */}
        <div className={cx('content')}>{children}</div>
      </div>
      <Footer/>
    </div>
  );
}

export default DefaultLayout;
