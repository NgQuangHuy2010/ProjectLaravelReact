import styles from "./Header.module.scss";
import images from "~/assets/images";
import Menu from "~/components/Popper/Menu/Menu";
import config from "~/config";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind"; //npm i classnames
import "@fortawesome/fontawesome-free/css/all.min.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Dropdown, Space } from "antd";
const cx = classNames.bind(styles);
const items = [
  {
    label: "Việt Nam",
    key: "0",
    icon: <img src={images.flagVietNam}  alt="vietnam"  className={cx('img-flag-language-header')}  />,
  },
  {
    label: "English",
    key: "1",
    icon: <img src={images.flagEnglish}  alt="English" className={cx('img-flag-language-header')}  />,

  },
 
];

function Header() {
  const [selectedLanguage, setSelectedLanguage] = useState(items[1]);

  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    if (selectedItem) {
      setSelectedLanguage(selectedItem); // Update to the whole selected item
    }
  };

  const dropdownItems = items
  .filter(item => item.label !== selectedLanguage.label) // Exclude the selected language
  .map(item => ({
    key: item.key,
    label: (
      <span>
        {item.icon} {/* Only one icon per language */}
        {item.label}
      </span>
    ),
  }));


  const selectedItem = {
    label: (
      <span >
        <span className={cx("text-header")}>{selectedLanguage.icon}</span>

        <span className={cx("text-header")}>{selectedLanguage.label}</span>
        <i className="fa-solid fa-check" style={{ color: 'green', marginLeft: 14 }}></i>

      </span>
    ),
    key: selectedLanguage.key, // Use the key of the selected language
  };



  const userMenu = [
    {
      icon: <i className="fa-regular fa-id-card"></i>,
      title: "View Profile",
      to: "/profile",
    },
    {
      icon: <i className="fa-solid fa-right-from-bracket"></i>,
      title: "Logout",
      to: "/logout",
      separate: true,
    },
  ];
  return (
    <header className={cx("wrapper")}>
      <div className={cx("content")}>
        <div className={cx("logo")}>
          <Link to={config.routes.home}>
            <img src={images.logo} alt="imagelogo" style={{ maxWidth: 150 }} />
          </Link>
        </div>
        <div className={cx("action")}>
          <>
            <Dropdown
              menu={{
                items: [selectedItem, ...dropdownItems],
                onClick: handleMenuClick,
              }}
              trigger={["click"]}
            >
              <div
                onClick={(e) => e.preventDefault()}
                className="fs-5 bg-white d-flex align-items-center justify-content-center p-2"
              >
                <Space className=" d-flex align-items-center">
                <div className={cx('language-header')} >
                {selectedLanguage.icon} 
                {selectedLanguage.label}
                </div>
                  <i className="fa-solid fa-sort-down mb-3"></i>
                </Space>
              </div>
            </Dropdown>
          </>
          <>
            <Tippy content="Upload video" placement="bottom">
              <button className={cx("action-btn")}>
                <i className="fa-solid fa-envelope"></i>
              </button>
            </Tippy>
          </>
          <Menu items={userMenu}>
            <i
              className={cx("user-avatar", "fa-solid", "fa-circle-user")}
              alt="Admin"
            ></i>
          </Menu>
        </div>
      </div>
    </header>
  );
}

export default Header;
