import React, { useState } from 'react';
import MenuItem from './Menu';
import classNames from 'classnames/bind';
import styles from '~/layouts/DefaultLayout/Sidebar/Menu/Menu.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function SubMenu({ title, icon, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div 
      className={cx('submenu-wrapper')}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MenuItem 
        title={title} 
        to="" 
        icon={icon}
        hasSubmenu
      />
      {isOpen && (
        <div className={cx('submenu')}>
          {children}
        </div>
      )}
    </div>
  );
}

SubMenu.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  children: PropTypes.node.isRequired,
};

export default SubMenu;
