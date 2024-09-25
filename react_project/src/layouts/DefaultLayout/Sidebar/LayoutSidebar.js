import React, { useState } from "react";
import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
import Menu, { MenuItem } from "./Menu"; // Import Menu và MenuItem từ custom component của bạn
import config from "~/config"; // Đường dẫn config
const cx = classNames.bind(styles);

function Sidebar() {
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const handleMouseEnter = () => {
    setOpenSubmenu(true);
  };

  const handleMouseLeave = () => {
    setOpenSubmenu(false);
  };
  return (
    <aside className={cx("wrapper")}>
      <Menu>
        <MenuItem
          title="Dashboard"
          to={config.routes.home}
          icon={<i className="fa-solid fa-house"></i>}
        />

        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <MenuItem
            title="Hàng hóa"
            icon={<i className="fa-solid fa-list"></i>}
            to=""
          />

          {openSubmenu && (
            <div className={cx("submenu")}>
              <MenuItem
                title="Danh mục"
                to={config.routes.category}
                icon={<i className="fa-solid fa-list"></i>}
                
              />
              <MenuItem
                title="Danh mục 2"
                to={config.routes.profile}
                icon={<i className="fa-solid fa-list"></i>}
              />
            </div>
          )}
        </div>

   
      </Menu>
    </aside>
  );
}

export default Sidebar;
