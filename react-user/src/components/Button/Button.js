import styles from "./Button.moule.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
const cx = classNames.bind(styles);

function Button({className,leftIcon,rightIcon, to, href, onClick,text= false,small= false,large=false,primary = false,outline=false, children,...passProps }) {
  let Component = "button";
  const props = {
    onClick,
    ...passProps
  };
  if (to) {
    props.to = to;
    Component = Link;
  } else if (href) {
    props.href = href;
    Component = "a";
  }
  const classes = cx("wrapper",{
    [className]:className,
    primary,
    outline,
    small,
    large,
    text
  });
  return (
    <Component className={classes} {...props}>
      {leftIcon && <span className={cx('iconLogin')}>{leftIcon}</span>}
      <span className={cx('title')}>{children}</span>
      {rightIcon && <span className={cx('iconLogin')}>{rightIcon}</span>}

    </Component>
  );
}
export default Button;
