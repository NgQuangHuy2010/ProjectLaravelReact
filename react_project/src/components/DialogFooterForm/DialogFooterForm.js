import { Button } from "primereact/button";
import cx from "classnames"; // Đảm bảo đã import cx để không bị lỗi

const DialogFooterForm = ({ onConfirm, onCancel, isSubmitting }) => (
  <>
    <Button
      className={cx("dialogFooterButton")}  // className cho button "Đồng ý"
      label="Đồng ý"
      icon="pi pi-check"
      severity="danger"
      onClick={onConfirm}
      disabled={isSubmitting}
    />
    <Button
      className={cx("dialogFooterButton", "btn btn-secondary py-2 px-4 mx-3")} // className cho button "Bỏ qua"
      label="Bỏ qua"
      icon="pi pi-times"
      outlined
      onClick={onCancel}
    />
  </>
);

export default DialogFooterForm;
