import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { NavLink } from "react-router-dom";

import Styles from './Menu.module.scss'

const cx=classNames.bind(Styles)


function MenuItem({ title, to, icon }) {
  return (
    <NavLink to={to} className={(nav)=>cx('menu-item',{active: nav.isActive})}>
      {icon}
      <span className={cx('title')}>{title}</span>
    </NavLink>
  );
}
MenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};
export default MenuItem;
