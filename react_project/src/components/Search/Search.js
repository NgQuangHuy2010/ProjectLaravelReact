import { useEffect, useState, useRef } from "react";
import HeadlessTippy from "@tippyjs/react/headless";
import "@fortawesome/fontawesome-free/css/all.min.css";
import classNames from "classnames/bind";


import { Wrapper as PopperWrapper } from "~/components/Popper";
import AccountItem from "~/components/AccountItem/AccountItem";
import styles from "./Search.module.scss";
import useDebounce from "~/hook/useDebounce";

import * as searchServices from "~/services/searchServices";
const cx = classNames.bind(styles);
function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(true);
  const inputRef = useRef();
  const debounce = useDebounce(searchValue, 800); //set thoi gian show ket qua tim kiem

  useEffect(() => {
    if (!searchValue.trim()) {
      return;
    }
    const fetchApi = async () => {
      const result = await searchServices.search(debounce);
      setSearchResult(result);
    };
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounce]);
  const handleHideResult = () => {
    setShowResult(false);
  };
  const handleChange =(e)=>{
    const searchValue = e.target.value;
    //neu ng dùng ko nhập khoảng trắng vào tìm kiếm  thì mới tiếp tục
    if(!searchValue.startsWith(' ')){
      setSearchValue(e.target.value)
    }
  }
  return (
    //lồng div cho HeadlessTippy để tippy ko báo warning 
 <div>
     <HeadlessTippy
      onClickOutside={handleHideResult}
      interactive
      visible={showResult && searchResult.length > 0}
      content="Tim kiem"
      render={(attrs) => (
        <div className={cx("search-result")} tabIndex="-1" {...attrs}>
          <PopperWrapper>
            <h3 className={cx("search-title")}>Accounts</h3>
            {searchResult.map((result) => (
              <AccountItem key={result.id} data={result} />
            ))}
          </PopperWrapper>
        </div>
      )}
    >
      <div className={cx("search")}>
        <input
          placeholder="Search video..."
          ref={inputRef}
          value={searchValue}
          spellCheck={false}
          
          onChange={handleChange}
          // onFocus={() => setShowResult(true)}
        />
        {/* khi có value mới hiện button xóa */}
        {!!searchValue && (
          <button
            className={cx("clear")}
            onClick={() => {
              setSearchValue("");
              setSearchResult([]);
              inputRef.current.focus();
            }}
          >
            <i className="fa-solid fa-circle-xmark"></i>
          </button>
        )}
        {/* <i className={cx("loading")} className="fa-solid fa-spinner"></i> */}

        <button
          className={cx("search-btn", { disabled: !searchValue })}
          disabled={!searchValue}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </HeadlessTippy>
 </div>
  );
}

export default Search;
