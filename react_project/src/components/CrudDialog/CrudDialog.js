import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";
import styles from "~/layouts/DefaultLayout/DefaultLayout.module.scss";
import DialogFooterForm from "../DialogFooterForm/DialogFooterForm";

const cx = classNames.bind(styles);

const CrudDialog = ({
  visible,
  header,
  isEditing,
  formFields,
  control,
  errors,
  onHide,
  onDelete,
  onSubmit,
  confirmDialogVisible,
  setConfirmDialogVisible,
  headerComfirmDelete,
  contentComfirmDelete,
  isSubmitting
}) => {
  const { t } = useTranslation();

  const DialogFooter = () => (
    <>
      <Button
        label={t("categoryPage.footerButon-modal-save")}
        icon="pi pi-save"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="btn btn-primary py-2 px-4 mx-3"
      />
      <Button
        label={t("categoryPage.footerButon-modal-cancel")}
        icon="pi pi-times"
        outlined
        onClick={onHide}
        className="btn btn-secondary py-2 px-4 mx-3"
      />
      {isEditing && onDelete && (
        <Button
          label={t("categoryPage.footerButon-modal-delete")}
          icon="pi pi-trash"
          outlined
          severity="danger"
          className="btn btn-danger py-2 px-4 mx-3"
          onClick={() => setConfirmDialogVisible(true)}
        />
      )}
    </>
  );

  return (
    <>
      <Dialog
        visible={visible}
        header={header}
        onHide={onHide}
        footer={<DialogFooter />}
        className={cx("p-fluid", "modal-config")}
      >
        <form>
          {formFields.map(({ name, label, placeholder }, index) => (
            <div key={index} className={cx("field")}>
              <label htmlFor={name} className="font-bold">
                {label}
                <span className="text-danger">*</span>
              </label>
              <Controller
                name={name}
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <InputText
                    id={name}
                    {...field}
                    placeholder={placeholder}
                    className={cx("custom-input", {
                      "p-invalid": errors[name],
                    })}
                  />
                )}
              />
              {errors[name] && (
                <small className="p-error">{errors[name].message}</small>
              )}
            </div>
          ))}
        </form>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        className={cx("confirm-delete")}
        visible={confirmDialogVisible}
        style={{ width: "50rem" }}
        header={headerComfirmDelete}
        modal
        footer={
          <DialogFooterForm
            onConfirm={onDelete} // Hàm xác nhận xóa
            onCancel={() => setConfirmDialogVisible(false)} // Hàm hủy bỏ
             isSubmitting={isSubmitting} 
          />
        }
        onHide={() => setConfirmDialogVisible(false)}
      >
        <div className={cx("confirmation-content")}>
          <i
            className="pi pi-exclamation-triangle p-mr-3"
            style={{ fontSize: "2rem", marginRight: "3px" }}
          />
          {contentComfirmDelete}
        </div>
      </Dialog>
    </>
  );
};

export default CrudDialog;
