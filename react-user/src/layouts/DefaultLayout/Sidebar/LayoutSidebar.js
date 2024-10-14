
import styles from './Sidebar.module.scss';
import classNames from "classnames/bind";
import Menu, {MenuItem} from './Menu'
import config from '~/config';
const cx = classNames.bind(styles);

function Sidebar() {
  return (
  <aside className={cx('wrapper')}>
  <Menu>
    <MenuItem title="For your" to={config.routes.home} icon={<i className="fa-solid fa-house"></i>}/>
    <MenuItem title="Following" to={config.routes.following} icon={<i className="fa-solid fa-users"></i>}/>

  </Menu>
</aside>
)
}

export default Sidebar;
