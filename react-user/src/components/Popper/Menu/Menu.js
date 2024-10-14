import Tippy from "@tippyjs/react/headless";
import classNames from "classnames/bind"; //npm i classnames

import { Wrapper as PopperWrapper } from "~/components/Popper";
import styles from "./Menu.module.scss";
import MenuItem from "./MenuItem";
import Header from "./Header";
import { useState } from "react";


const cx = classNames.bind(styles);
function Menu({ children, items = [] }) {
const[history,setHistory]= useState([{data:items}]);
const current = history[history.length - 1]
  
  const renderItem = () => {
    return current.data.map((item, index) => 
    {
      const isParent = !!item.children
      return <MenuItem key={index} data={item} onClick={()=>{

        if(isParent){
     
          
          setHistory((prev) => [...prev, item.children]);
        }
      }}/>
    }
    );
  };
  return (
    <Tippy
    hideOnClick={false}
      interactive
      delay={[0,500]}
      offset={[20,10]}
      placement="bottom-end"
      content="Tim kiem"
      render={(attrs) => (
        <div className={cx("content")} tabIndex="-1" {...attrs}>
          <PopperWrapper className={cx('menu-popper')}>
          {history.length > 1 && ( 
            <Header 
            title="Language" 
            onBack={()=>{
            setHistory((prev) => prev.slice(0, prev.length - 1))
            
          }}/>
          )}
            <div className={cx('menu-body')} >{renderItem()}</div>
          </PopperWrapper>
        </div>
      )}
      //hover menu khi click chon neu ko hover nua cho ve lai menu ban dau
      onHide={()=> setHistory((prev)=> prev.slice(0,1))}
    >
      {children}
    </Tippy>
  );
}

export default Menu;
