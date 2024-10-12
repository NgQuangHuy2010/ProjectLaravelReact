import React from 'react';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t('homePage.title')}</h2> {/* Sử dụng khóa bản dịch */}
   
    </div>
  );
}

export default Home;
