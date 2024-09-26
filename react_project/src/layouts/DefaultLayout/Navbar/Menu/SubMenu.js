// Submenu.jsx
import React, { useState } from "react";
import classNames from "classnames/bind";
import MenuItem from "./MenuItem"; // Import MenuItem from your custom component
import styles from "~/layouts/DefaultLayout/Navbar/Navbar.module.scss"; // Import styles for the submenu

const cx = classNames.bind(styles);

function Submenu({ parentTitle, icon, routes }) {
  const [openSubmenu, setOpenSubmenu] = useState(false);

  const handleMouseEnter = () => {
    setOpenSubmenu(true);
  };

  const handleMouseLeave = () => {
    setOpenSubmenu(false);
  };

  // Get the current path
  const currentPath = window.location.pathname;

  // Determine if the parent is active
  const isParentActive = routes.some(route => currentPath === route.path);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <MenuItem
        title={parentTitle}
        icon={icon}
        to=""
        isActive={isParentActive} // Parent is active if any child is active
      />
      {openSubmenu && (
        <div className={cx("submenu")}>
          {routes.map(route => (
            <MenuItem
              key={route.path}
              title={route.title}
              to={route.path}
              icon={<i className="fa-solid fa-list"></i>}
              isActive={currentPath === route.path} // Active if on the child route
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Submenu;
