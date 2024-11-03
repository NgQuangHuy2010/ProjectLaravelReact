// AttributesPanel.js
import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Collapse } from "antd";
import classNamesConfig from "classnames/bind";
import styles from "~/layouts/DefaultLayout/DefaultLayout.module.scss";
const cx = classNamesConfig.bind(styles);

const AttributesForm = ({
  attributes,
  attributeValues,
  handleInputChange,
  control,
  errors,
}) => {
  const { t } = useTranslation();

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
        </div>
      ),
    },
  ];

  return (
    <Collapse
      className="mt-4"
      size="small"
      expandIconPosition="end"
      items={panels}
    />
  );
};

export default AttributesForm;
