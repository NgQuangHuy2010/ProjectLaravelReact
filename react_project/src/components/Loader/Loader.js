import React from 'react';
import styles from './Loader.module.scss'; // Import SCSS module

const Loader = () => {
  return (
    <div className={styles['three-body-wrapper']}>
      <div className={styles['three-body']}>
        <div className={styles['three-body__dot']}></div>
        <div className={styles['three-body__dot']}></div>
        <div className={styles['three-body__dot']}></div>
      </div>
    </div>
  );
};

export default Loader;
