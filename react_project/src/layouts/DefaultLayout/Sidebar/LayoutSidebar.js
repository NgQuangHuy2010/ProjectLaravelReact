
import styles from './Sidebar.module.scss';
import classNames from "classnames/bind";
import Menu, {MenuItem} from './Menu'
import config from '~/config';
const cx = classNames.bind(styles);

function Sidebar() {
  return (
  <aside className={cx('wrapper')}>
  <Menu>
    <MenuItem title="Dashboard" to={config.routes.home} icon={<i className="fa-solid fa-house"></i>}/>
    <MenuItem title="Tài khoản" to={config.routes.account}  icon={<i className="fa-solid fa-users"></i>}/>
    <MenuItem title="Danh mục" to={config.routes.category}  icon={<i className="fa-solid fa-list"></i>}/>
    <MenuItem title="Sản phẩm" to={config.routes.product} icon={<i className="fa-solid fa-warehouse"></i>}/>
    
  </Menu>
</aside>
)
}

export default Sidebar;
