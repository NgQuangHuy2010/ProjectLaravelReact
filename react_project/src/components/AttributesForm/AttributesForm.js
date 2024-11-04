// AttributesPanel.js
import React, { useState } from "react";
import { Controller,useForm  } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import { Collapse } from "antd";
import classNamesConfig from "classnames/bind";
import styles from "~/layouts/DefaultLayout/DefaultLayout.module.scss";
import CrudDialog from "../CrudDialog/CrudDialog";
const cx = classNamesConfig.bind(styles);

const AttributesForm = ({
  attributes,
  attributeValues,
  handleInputChange,
  control,
  errors,
}) => {
  const { t } = useTranslation();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const { control: formControl,handleSubmit,setValue, reset } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [currentAttribute, setCurrentAttribute] = useState({ name: "", id: null });

  // Chỉ một input field cho form
  const formFields = [
    { name: "attribute_name", label: "Thuộc tính", placeholder: "" },
  ];

  // Hàm xử lý khi submit form
  const handleSave = (data) => {
 
  };

  // Hàm xử lý khi nhấn xóa
  const handleDelete = () => {
   
    setConfirmDialogVisible(false);
  };

  // Mở dialog tạo mới
  const openNew = () => {
    reset();
    setIsEditing(false);
    setDialogVisible(true);
  };

  // Mở dialog chỉnh sửa
  const openEdit = (attr) => {
    setIsEditing(true);
    setCurrentAttribute({ name: attr.attribute_name, id: attr.id });
    setDialogVisible(true);
    setValue("attribute_name", attr.attribute_name);
  };

  const panels = [
    {
      key: "1",
      label: (
        <strong className="px-2 ">
          {t("productPage.header-collapse-attribute")}
          <Tippy
            content="Chọn danh mục để có thuộc tính tương ứng"
            placement="right"
            className={cx("tippy-tooltip")}
          >
            <span className="px-3">
              <i className="fa-solid fa-circle-info"></i>
            </span>
          </Tippy>
        </strong>
      ),
      children: (
        <div className="mt-4">
          {attributes.map((attr) => (
            <div key={attr.id} className="form-group mb-3 row">
              <div className="col-md-3">
                <label
                  htmlFor={`attribute_${attr.id}`}
                  className="fw-bold fs-5"
                >
                  {attr.attribute_name}
                </label>
              </div>
              <div className="col-md-4">
                <Controller
                  name={`attributes.${attr.id}`}
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <InputText
                      value={attributeValues[attr.id] || ""}
                      onChange={(e) =>
                        handleInputChange(attr.id, e.target.value)
                      }
                      id={`attribute_${attr.id}`}
                      className={cx("custom-input", "form-control")}
                      {...field}
                      placeholder="Nhập giá trị"
                    />
                  )}
                />
              </div>
              <div className="col-md-5">
                <Button
                  type="button"
                  onClick={() => openEdit(attr)}
                  title={t("productPage.title-button-attribute")}
                  icon="pi pi-pencil"
                  outlined
                  className={cx("mr-2", "button-dropdown")}
                />
              </div>

              {errors[`attribute_${attr.id}`] && (
                <small className="p-error">
                  {errors[`attribute_${attr.id}`].message}
                </small>
              )}
            </div>
          ))}
          <div className="row">
            <Button
              type="button"
              onClick={openNew}
              outlined
              className={cx("mr-2", "button-dropdown")}
            >
              Tạo mới
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Collapse
        className="mt-4"
        size="small"
        expandIconPosition="end"
        items={panels}
      />

      <CrudDialog
        visible={dialogVisible}
        header={isEditing ? "Chỉnh sửa thuộc tính" : "Thêm thuộc tính"}
        isEditing={isEditing}
        formFields={formFields} // Truyền formFields với một input duy nhất
        control={formControl}
        errors={errors}
        onHide={() => setDialogVisible(false)}
        onDelete={handleDelete}
        onSubmit={handleSubmit(handleSave)}
        confirmDialogVisible={confirmDialogVisible}
        setConfirmDialogVisible={setConfirmDialogVisible}
      />
    </>
  );
};

export default AttributesForm;
