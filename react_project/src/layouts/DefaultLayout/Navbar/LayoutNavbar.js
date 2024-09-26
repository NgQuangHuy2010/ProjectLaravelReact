// Sidebar.jsx
import styles from "./Navbar.module.scss";
import classNames from "classnames/bind";
import Menu, { MenuItem } from "./Menu"; // Import Menu and MenuItem from your custom component
import config from "~/config"; // Import your config routes
import Submenu from "./Menu/SubMenu";
const cx = classNames.bind(styles);

function Sidebar() {
  const currentPath = window.location.pathname;
  const isActive = (path) => currentPath === path;
  return (
    <aside className={cx("wrapper")}>
      <Menu>
        <MenuItem
          title="Dashboard"
          to={config.routes.home}
          icon={<i className="fa-solid fa-house"></i>}
          isActive={isActive(config.routes.home)}
        />
        
        <Submenu 
          parentTitle="Hàng hóa"
          icon={<i className="fa-solid fa-list"></i>}
          routes={[
            { title: "Danh mục", path: config.routes.category },
            { title: "Danh mục 2", path: config.routes.profile }
          ]}
        />
        
        {/* You can add more Submenu components here in the future */}
        <Submenu 
          parentTitle="Another Section"
          icon={<i className="fa-solid fa-folder"></i>}
          routes={[
            { title: "Submenu 1", path: "/submenu1" },
            { title: "Submenu 2", path: "/submenu2" }
          ]}
        />
      </Menu>
    </aside>
  );
}

export default Sidebar;
