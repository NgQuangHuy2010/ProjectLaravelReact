// AttributesPanel.js
import React, { useState, useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Collapse } from "antd";
import classNamesConfig from "classnames/bind";

import styles from "~/layouts/DefaultLayout/DefaultLayout.module.scss";
import CrudDialog from "../CrudDialog/CrudDialog";
import {
  createAttributes,
  editAttributes,
  deleteAttributes,
} from "~/services/AttributeDefinitions";
import { validateSchema } from "~/components/validateSchema/validateSchema";
const cx = classNamesConfig.bind(styles);

const AttributesForm = ({
  fetchAttributes,
  categoryId,
  attributes,
  attributeValues,
  handleInputChange,
  control,
}) => {
  const { t } = useTranslation();
  const toast = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái lưu trữ xem form có đang trong quá trình gửi dữ liệu hay không
  const [dialogVisible, setDialogVisible] = useState(false); // Trạng thái lưu trữ việc hiển thị dialog
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false); // Trạng thái lưu trữ việc hiển thị dialog xác nhận trước khi xóa
  const [isEditing, setIsEditing] = useState(false); // Trạng thái lưu trữ việc xác định chế độ chỉnh sửa (true nếu đang chỉnh sửa thuộc tính, false nếu đang tạo mới)
  const [currentAttribute, setCurrentAttribute] = useState({
    // Trạng thái lưu trữ thông tin thuộc tính hiện tại đang được chỉnh sửa (bao gồm tên và id)
    name: "",
    id: null,
  });

  // Chỉ một input field cho form
  const formFields = [
    {
      name: "attribute_name",
      label: <>{t("productPage.label-form-modal-attribute")}</>,
      placeholder: "",
      type: "string",
      required: true,
      message: "Tên thuộc tính là bắt buộc", //lỗi thông báo khi user bỏ trống dc truyền từ component validateSchema
    },
  ];
  // Sử dụng component validateSchema để tạo schema validation từ các trường đã định nghĩa
  const schema = validateSchema(formFields);
  const {
    control: formControl, // Đối tượng điều khiển các input field
    handleSubmit, // Hàm xử lý submit form
    setValue, // Hàm để thiết lập giá trị cho các trường input
    reset, // Hàm để reset giá trị form về mặc định
    formState: { errors }, // Trạng thái form, bao gồm thông tin lỗi
  } = useForm({
    // Cấu hình cho useForm, sử dụng yupResolver để tích hợp với schema validation
    resolver: yupResolver(schema), // Kết nối với schema validation bằng yup
  });
  //post
  const postAttributes = async (data) => {
    try {
      // Tạo payload để gửi đến API, bao gồm dữ liệu từ form và idCategory
      const payload = { ...data, idCategory: categoryId };
      // Gọi API để tạo thuộc tính mới
      await createAttributes(payload);
      toast.current.show({
        severity: "success",
        summary: t("categoryPage.title-message"),
        detail: t("categoryPage.content-message"),
        life: 3000,
      });
      // Load lại data ngay sau khi thêm xong
      fetchAttributes(categoryId);
      // Ẩn dialog và reset form về giá trị mặc định
      setDialogVisible(false);
      reset(); // reset form
    } catch (error) {
      console.error("Failed to save:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save ",
        life: 3000,
      });
    }
  };

  const updateAttributes = async (data, id) => {
    try {
      // Gọi editCategory với thông tin cần thiết
      await editAttributes(id, {
        attribute_name: data.attribute_name,
        idCategory: categoryId,
      });
      toast.current.show({
        severity: "success",
        summary: t("categoryPage.title-message"),
        detail: t("categoryPage.content-message-update"),
        life: 3000,
      });
      setDialogVisible(false); //ẩn dialog
      // Load lại data ngay sau khi thêm xong
      fetchAttributes(categoryId);
    } catch (error) {
      console.error("Failed to save Category:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update Category",
        life: 3000,
      });
    }
  };
  const deleteCategory = async () => {
    if (isSubmitting) return; // Nếu đang submit, bỏ qua
    setIsSubmitting(true); // Vô hiệu hóa nút
    try {
      await deleteAttributes(currentAttribute.id);
      setDialogVisible(false); //ẩn dialog
      fetchAttributes(categoryId);
      toast.current.show({
        severity: "success",
        summary: t("categoryPage.title-message"),
        detail: "Xóa thành công!!",
        life: 3000,
      });
    } catch (error) {
      // lấy phản hồi  "message" từ api xuống để thông báo lỗi lên giao diện
      const errorMessage = error?.response?.data?.message || "Không thể xóa";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
      });
    } finally {
      // Bật lại nút sau khi hoàn tất
      setIsSubmitting(false);
    }
  };
  // Hàm xử lý khi submit form
  const handleSave = async (data) => {
    if (isSubmitting) return; // Nếu đang submit, bỏ qua
    setIsSubmitting(true); // Vô hiệu hóa nút

    try {
      //nếu có id thì chạy hàm update nếu ko có id chạy hàm post new
      if (currentAttribute && currentAttribute.id) {
        await updateAttributes(data, currentAttribute.id);
      } else {
        await postAttributes(data);
      }
      // Sau khi hoàn thành, bật lại nút
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error saving attribute:", error);
    } finally {
      // Bật lại nút sau khi hoàn tất
      setIsSubmitting(false);
    }
  };

  // Hàm xử lý khi nfalsehấn xóa
  const handleDelete = async (id) => {
    deleteCategory(id);
    setConfirmDialogVisible(false);
    setCurrentAttribute(null);
  };

  // Mở dialog tạo mới
  const openNew = () => {
    // console.log("Đang mở form với categoryId:", categoryId);
    reset();
    setCurrentAttribute(null); // Đặt lại thuộc tính hiện tại để không có giá trị nào được chỉnh sửa
    setIsEditing(false); // Đặt chế độ chỉnh sửa về false, nghĩa là đây là form để tạo mới
    setDialogVisible(true); // Hiển thị dialog để người dùng có thể nhập thông tin mới
  };

  // Mở dialog chỉnh sửa
  const openEdit = (attr) => {
    setIsEditing(true); // Thiết lập chế độ chỉnh sửa thành true, cho biết rằng người dùng đang chỉnh sửa một thuộc tính
    setCurrentAttribute({ name: attr.attribute_name, id: attr.id }); // Lưu thông tin thuộc tính hiện tại vào state
    setDialogVisible(true);
    setValue("attribute_name", attr.attribute_name); // Đặt giá trị trường "attribute_name" trong form thành giá trị hiện tại của thuộc tính
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
                <button
                  type="button"
                  onClick={() => openEdit(attr)}
                  title={t("productPage.title-button-attribute")}
                  outlined
                  className={cx("mr-2", "button-edit-attribute")}
                >
                  <i className="fa-solid fa-pencil"></i>
                </button>
              </div>

              {errors[`attribute_${attr.id}`] && (
                <small className="p-error">
                  {errors[`attribute_${attr.id}`].message}
                </small>
              )}
            </div>
          ))}
          {categoryId && (
            <div className="row">
              <div className="col-3">
                <button
                  type="button"
                  onClick={openNew}
                  outlined
                  className={cx(
                    "mr-2 btn btn-secondary",
                    "button-create-attribute"
                  )}
                >
                  {t("attributesDefinition.button-create-attributes")}
                </button>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Toast ref={toast} />
      <Collapse
        className="mt-4"
        size="small"
        expandIconPosition="end"
        items={panels}
      />
      <CrudDialog
        visible={dialogVisible}
        header={
          isEditing
            ? t("categoryPage.title-modal-update")
            : t("categoryPage.title-modal-create")
        }
        isEditing={isEditing}
        formFields={formFields} // Truyền formFields với một input duy nhất
        control={formControl}
        errors={errors}
        onHide={() => setDialogVisible(false)}
        onDelete={handleDelete}
        onSubmit={handleSubmit(handleSave)}
        confirmDialogVisible={confirmDialogVisible}
        setConfirmDialogVisible={setConfirmDialogVisible}
        headerComfirmDelete={t(
          "attributesDefinition.title-confirm-modal-delete"
        )}
        contentComfirmDelete={t(
          "attributesDefinition.content-confirm-modal-delete"
        )}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default AttributesForm;
