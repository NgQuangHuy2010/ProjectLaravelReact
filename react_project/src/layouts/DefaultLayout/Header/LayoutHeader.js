import styles from "./Header.module.scss";

import Button from "~/components/Button/Button";
import images from "~/assets/images";

import { Link } from "react-router-dom";
import classNames from "classnames/bind"; //npm i classnames
import "@fortawesome/fontawesome-free/css/all.min.css";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css'; 
import Search  from "~/components/Search/Search";
import Menu from "~/components/Popper/Menu/Menu";
import config from '~/config'

const cx = classNames.bind(styles);
const MENU_ITEM = [
  {
    icon: <i className="fa-solid fa-language"></i>,
    title: "English",
    children: {
      title: "Language",
      data: [
        {
          code: "en",
          title: "English",
        },
        {
          code: "vie",
          title: "Tiếng Việt",
        },
      
      ],
    },
  },
  {
    icon: <i className="fa-solid fa-circle-question"></i>,
    title: "Feedback",
    to: "/feedback",
  },
  {
    icon: <i className="fa-regular fa-keyboard"></i>,
    title: "Keyboard",
  },
];
function Header() {
  const currentUser = true;


  const userMenu =[
    {
      icon: <i className="fa-solid fa-user"></i>,
      title: "View Profile",
      to: "/profile",
    },
    {
      icon: <i className="fa-solid fa-circle-question"></i>,
      title: "Get coins",
      to: "/coins",
    },
    {
      icon: <i className="fa-solid fa-gear"></i>,
      title: "Settings",
      to: "/setting",
    },
    ...MENU_ITEM,  //tai su dung lai menu more 
    {
      icon: <i className="fa-solid fa-right-from-bracket"></i>,
      title: "Logout",
      to: "/logout",
      separate:true,
    },
  ]
  return (
    <header className={cx("wrapper")}>
      <div className={cx("content")}>
        <div className={cx("logo")}>
          <Link to={config.routes.home}><img src={images.logo} alt="imagelogo" style={{maxWidth:150}} /></Link>
        </div>

       {/* search */}
       <Search/>
        
        <div className={cx("action")}>
          {currentUser ? (
            <>
              <Tippy  content="Upload video" placement="bottom">
                <button className={cx('action-btn')}>
                  <i className="fa-solid fa-envelope"></i>
                </button>
              </Tippy>

            </>
          ) : (
            <>
              <Button text>Upload</Button>
              <Button
                primary
                leftIcon={<i className="fa-solid fa-right-to-bracket"></i>}
              >
                {" "}
                Log in{" "}
              </Button>
            </>
          )}
          <Menu items={currentUser ? userMenu :  MENU_ITEM}>
            {currentUser ? (
              <img src="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/0226dbeb0943b706ec9f5cd41c327dd9.jpeg?lk3s=a5d48078&nonce=15488&refresh_token=3ad5bd56f614eff708988ea8999f307e&x-expires=1726106400&x-signature=J5oVwZhVdD4EkLg8sy2RvVUoK1A%3D&shp=a5d48078&shcp=b59d6b55" 
              className={cx("user-avatar")} 
              alt="Nguyen Van A" />
            ) : (
              <button className={cx("more-btn")}>
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </button>
            )}
          </Menu>
        </div>
      </div>
    </header>
  );
}

export default Header;
