// MenuItem.jsx
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { NavLink } from "react-router-dom";
import Styles from './Menu.module.scss';

const cx = classNames.bind(Styles);

function MenuItem({ title, to, icon, isActive }) {
  return (
    <NavLink to={to} className={cx('menu-item', { active: isActive })}>
      <span className={cx('icon')}>{icon}</span>
      <span className={cx('title')}>{title}</span>
    </NavLink>
  );
}

MenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  isActive: PropTypes.bool,
};

export default MenuItem;
