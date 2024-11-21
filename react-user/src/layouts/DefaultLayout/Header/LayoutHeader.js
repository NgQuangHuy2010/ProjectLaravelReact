import styles from "./Header.module.scss";

import Button from "~/components/Button/Button";
import images from "~/assets/images";

import { Link } from "react-router-dom";
import classNames from "classnames/bind"; //npm i classnames
import "@fortawesome/fontawesome-free/css/all.min.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Search from "~/components/Search/Search";
//import Menu from "~/components/Popper/Menu/Menu";
import config from "~/config";
import Login from "~/components/Account/Login";
import { useState } from "react";

const cx = classNames.bind(styles);
// const MENU_ITEM = [
//   {
//     icon: <i className="fa-solid fa-language"></i>,
//     title: "English",
//     children: {
//       title: "Language",
//       data: [
//         {
//           code: "en",
//           title: "English",
//         },
//         {
//           code: "vie",
//           title: "Tiếng Việt",
//         },
//       ],
//     },
//   },
//   {
//     icon: <i className="fa-solid fa-circle-question"></i>,
//     title: "Feedback",
//     to: "/feedback",
//   },
//   {
//     icon: <i className="fa-regular fa-keyboard"></i>,
//     title: "Keyboard",
//   },
// ];
function Header() {
  const currentUser = false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const userMenu = [
  //   {
  //     icon: <i className="fa-solid fa-user"></i>,
  //     title: "View Profile",
  //     to: "/profile",
  //   },
  //   {
  //     icon: <i className="fa-solid fa-circle-question"></i>,
  //     title: "Get coins",
  //     to: "/coins",
  //   },
  //   {
  //     icon: <i className="fa-solid fa-gear"></i>,
  //     title: "Settings",
  //     to: "/setting",
  //   },
  //   ...MENU_ITEM, //tai su dung lai menu more
  //   {
  //     icon: <i className="fa-solid fa-right-from-bracket"></i>,
  //     title: "Logout",
  //     to: "/logout",
  //     separate: true,
  //   },
  // ];
 
  const showModal = () => {
    setIsModalOpen(true); // Mở modal
  };

  const handleClose = () => {
    setIsModalOpen(false); // Đóng modal
  };
  return (
    <header className={cx("wrapper")}>
      <nav className={cx("navbar navbar-expand-lg  w-100", "bg-header")}>
        <div
          className={cx(
            "container-fluid d-flex justify-content-between align-items-center",
            "container-header"
          )}
        >
          {/* Logo */}
          <Link to={config.routes.home} className="navbar-brand">
            <img
              src={images.logo}
              alt="imagelogo"
              className={cx("image-logo")}
            />
          </Link>

          {/* Navbar Toggler for Mobile View */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapse for Mobile View */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="d-flex w-100 justify-content-center  align-items-center">
              {/* Search Component */}
              <div className=" mx-3 d-flex ">
                <Search />
              </div>

              {/* Action Buttons */}
              <div className="d-flex align-items-center">
                {currentUser ? (
                  <Tippy content="Upload video" placement="bottom">
                    <button className={cx("action-btn")}>
                      <i className="fa-solid fa-envelope"></i>
                    </button>
                  </Tippy>
                ) : (
                  <div className="px-5">
                    <Button
                      primary
                      leftIcon={<i className="fa-solid fa-cart-shopping"></i>}
                    >
                      Giỏ hàng
                    </Button>
                    <Button
                    onClick={showModal}
                      primary
                      leftIcon={<i className="fa-regular fa-circle-user"></i>}
                    >
                      Đăng nhập
                    </Button>
                    <Login isModalOpen={isModalOpen} onClose={handleClose} />
                  </div>
                )}
                {/* <Menu items={currentUser ? userMenu : MENU_ITEM}>
              {currentUser ? (
                <img
                  src="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/0226dbeb0943b706ec9f5cd41c327dd9.jpeg?lk3s=a5d48078&nonce=15488&refresh_token=3ad5bd56f614eff708988ea8999f307e&x-expires=1726106400&x-signature=J5oVwZhVdD4EkLg8sy2RvVUoK1A%3D&shp=a5d48078&shcp=b59d6b55"
                  className={cx("user-avatar")}
                  alt="Nguyen Van A"
                />
              ) : (
                <button className={cx("more-btn")}>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
              )}
            </Menu> */}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
