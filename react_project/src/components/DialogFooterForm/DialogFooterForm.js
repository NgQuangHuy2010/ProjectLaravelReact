import { Button } from "primereact/button";
import cx from "classnames"; // Đảm bảo đã import cx
import { useTranslation } from 'react-i18next';

const DialogFooterForm = ({ onConfirm, onCancel, isSubmitting }) => {
  const { t } = useTranslation(); // useTranslation phải nằm trong component function

  return (
    <>
      <Button
        className={cx("dialogFooterButton")}  // className cho button "Đồng ý"
        label={t('categoryPage.footerButon-modal-save')} 
        icon="pi pi-check"
        severity="danger"
        onClick={onConfirm}
        disabled={isSubmitting}
      />
      <Button
        label={t('categoryPage.footerButon-modal-cancel')} 
        className={cx("dialogFooterButton", "btn btn-secondary py-2 px-4 mx-3")} // className cho button "Bỏ qua"
        icon="pi pi-times"
        outlined
        onClick={onCancel}
      />
    </>
  );
};

export default DialogFooterForm;
