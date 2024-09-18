import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import classNamesConfig from "classnames/bind";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Image } from "antd";

import {
  getCategory,
  createCategory,
  deleteCategory as deleteCategoryApi,
} from "~/services/CategoryService";
 import { buildImageUrl } from '~/utils/imageUtils';
import styles from "~/layouts/DefaultLayout/DefaultLayout.module.scss";

const cx = classNamesConfig.bind(styles);
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

//validate
const schema = yup
  .object({
    name: yup.string().required("Tên danh mục là bắt buộc!!"),
    image: yup
      .mixed()
      .required("Hình ảnh là bắt buộc!!")
      .test(
        "fileSize",
        "Kích thước hình ảnh không được vượt quá 4MB",
        (value) => {
          return value && value.size <= 4096 * 1024; // Kiểm tra size file
        }
      )
      .test(
        "fileType",
        "Hình ảnh phải có định dạng jpeg, png, gif, jpg, ico, webp",
        (value) => {
          return (
            value &&
            [
              "image/jpeg",
              "image/png",
              "image/gif",
              "image/jpg",
              "image/ico",
              "image/webp",
            ].includes(value.type)
          ); // Kiểm tra định dạng file
        }
      ),
  })
  .required();

function Category() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const [Categorys, setCategorys] = useState([]);
  const [CategoryDialog, setCategoryDialog] = useState(false);
  const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
  const [deleteCategorysDialog, setDeleteCategorysDialog] = useState(false);
  const [selectedCategorys, setSelectedCategorys] = useState([]);
  const [Category, setCategory] = useState(null);
  const [dialogHeader, setDialogHeader] = useState("");

  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const dt = useRef(null);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = async ({ fileList: newFileList }) => {
    // Update file list
    setFileList(newFileList);

    // Clear previous errors
    clearErrors("image");

    // Validate files immediately
    try {
      await validateFiles(newFileList);

      // Update the form value with the first file if available
      setValue("image", newFileList[0]?.originFileObj || null);
    } catch (err) {
      // Handle validation errors if any
      console.error("Validation errors:", err);
    }
  };

  const validateFiles = (files) => {
    return Promise.all(
      files.map((file) => {
        return schema.validateAt("image", { image: file }).catch((err) => {
          setError("image", { type: "manual", message: err.message });
          return Promise.reject(err); // Reject if any file is invalid
        });
      })
    );
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  //get all list
  useEffect(() => {
    const fetchData = async () => {
      try {
        //import và gọi getCategory được export từ CategoryService
        const data = await getCategory();
        setCategorys(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  //post
  const postCategory = async (data) => {
    try {
      await validateFiles(fileList.map((file) => file.originFileObj));
      //import và gọi createCategory được export từ CategoryService
      await createCategory(data);
      const updatedCategorys = await getCategory();
      setCategorys(updatedCategorys);

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Category Created",
        life: 3000,
      });

      hideDialog();
      reset();
      setFileList([]); // Clear file list
      setPreviewImage(""); // Clear preview image
      setPreviewOpen(false); // Hide preview modal
    } catch (error) {
      console.error("Failed to save Category:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save Category",
        life: 3000,
      });
    }
  };

  const deleteCategory = async () => {
    try {
      //import và gọi deleteCategoryApi được export từ CategoryService
      await deleteCategoryApi(Category.id);

      // set lại interface
      setCategorys((prevCategories) =>
        prevCategories.filter((p) => p.id !== Category.id)
      );

      // Close the dialog modal
      setDeleteCategoryDialog(false);

      // Show success toast
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Category Deleted",
        life: 3000,
      });
    } catch (error) {
      // Handle the error and show error toast
      console.error("Failed to delete category:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete category",
        life: 3000,
      });
    }
  };

  //gán cho savecategory để submit 
  const saveCategory = (data) => {
    postCategory(data);
  };
  const openNew = () => {
    reset(); // Reset form khi mở dialog
    setCategoryDialog(true);
    setDialogHeader("Tạo mới");
  };
  const openEdit = () => {
    reset(); // Reset form when opening the dialog
    setDialogHeader("Cập nhật"); // Set header to "Cập nhật"
    setCategoryDialog(true); // Open the dialog
  };
  const hideDialog = () => {
    setCategoryDialog(false);
  };
  const confirmDeleteCategory = (Category) => {
    setCategory(Category);
    setDeleteCategoryDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteCategorysDialog(true);
  };

  const deleteSelectedCategorys = () => {
    setCategorys(Categorys.filter((p) => !selectedCategorys.includes(p)));
    setDeleteCategorysDialog(false);
    setSelectedCategorys([]);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Categorys Deleted",
      life: 3000,
    });
  };

  //Nút New và Deletes
  const leftToolbarTemplate = () => (
    <div className="flex flex-wrap gap-2">
      <Button
        className={cx("config-button")}
        label="New"
        icon="pi pi-plus"
        severity="success"
        onClick={openNew}
      />
      <Button
        className={cx("config-button")}
        label="Delete"
        icon="pi pi-trash"
        severity="danger"
        onClick={confirmDeleteSelected}
        disabled={!selectedCategorys.length}
      />
    </div>
  );

  //Nút export
  const rightToolbarTemplate = () => (
    <Button
      className={cx("config-button", "p-button-help")}
      label="Export"
      icon="pi pi-upload"
      onClick={() => dt.current.exportCSV()}
    />
  );

  const statusBodyTemplate = (rowData) => (
    <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>
  );

  // Nút cập nhật và xóa
  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        className="mr-2"
        onClick={() => {
          openEdit();
          setCategory(rowData);
          setCategoryDialog(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => confirmDeleteCategory(rowData)}
      />
    </>
  );

  const getSeverity = (Category) => {
    switch (Category.inventoryStatus) {
      case "INSTOCK":
        return "success";
      case "LOWSTOCK":
        return "warning";
      case "OUTOFSTOCK":
        return "danger";
      default:
        return null;
    }
  };

  const header = (
    <div
      className={cx(
        "flex flex-wrap gap-2 align-items-center justify-content-between"
      )}
    >
      <InputText
        type="search"
        onInput={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );

  const CategoryDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button
        label="Save"
        icon="pi pi-check"
        onClick={handleSubmit(saveCategory)}
      />
    </>
  );

  const deleteCategoryDialogFooter = (
    <>
      <Button
        className={cx("dialogFooterButton")}
        label="No"
        icon="pi pi-times"
        outlined
        onClick={() => setDeleteCategoryDialog(false)}
      />
      <Button
        className={cx("dialogFooterButton")}
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteCategory}
      />
    </>
  );

  const deleteCategorysDialogFooter = (
    <>
      <Button
        className={cx("dialogFooterButton")}
        label="No"
        icon="pi pi-times"
        outlined
        onClick={() => setDeleteCategorysDialog(false)}
      />
      <Button
        className={cx("dialogFooterButton")}
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedCategorys}
      />
    </>
  );


  const imageBodyTemplate = (rowData) => {
    const imageUrl = buildImageUrl(rowData.image_url);

    return (
        <img 
            src={imageUrl} 
            alt={rowData.name} 
            className="shadow-2 border-round" 
            style={{ width: '64px' }} 
        />
    );
};


  return (
    <div className={cx("dataTable-config")}>
      <Toast ref={toast} />
      <div className={cx("card")}>
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        />
        <DataTable
          className={cx("text-dataTable")}
          ref={dt}
          value={Categorys}
          selection={selectedCategorys}
          onSelectionChange={(e) => setSelectedCategorys(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Categorys"
          globalFilter={globalFilter}
          header={header}
        >
          <Column selectionMode="multiple" exportable={false} />
          <Column
            field="id"
            header="Stt"
            sortable
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="name"
            header="Name"
            sortable
            style={{ minWidth: "16rem" }}
          />
           <Column field="image" header="Image" body={imageBodyTemplate}></Column>
          <Column
            field="inventoryStatus"
            header="Status"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: "12rem" }}
          />
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          />
        </DataTable>
      </div>

      <Dialog
        visible={CategoryDialog}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={dialogHeader}
        modal
        className={cx("p-fluid", "modal-config")}
        footer={CategoryDialogFooter}
        onHide={hideDialog}
      >
        <form onSubmit={handleSubmit(postCategory)}>
          <div className={cx("field")}>
            <label htmlFor="name" className="font-bold">
              Name
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <InputText
                  id="name"
                  {...field}
                  style={{ border: "1px solid #9d9898" }}
                  className={cx({ "p-invalid": errors.name })}
                />
              )}
            />
            {errors.name && (
              <small className="p-error">{errors.name.message}</small>
            )}
          </div>

          <div className={cx("field")}>
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  customRequest={({ file, onSuccess }) => {
                    // Handle custom file upload
                    onSuccess(file);
                  }}
                  beforeUpload={() => false} // Disable auto upload
                  accept="image/*"
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              )}
            />
            {errors.image && (
              <small className="p-error">{errors.image.message}</small>
            )}
          </div>

          {previewImage && (
            <Image
              
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </form>
      </Dialog>

      <Dialog
        className={cx("confirm-delete")}
        visible={deleteCategoryDialog}
        style={{ width: "50rem" }}
        header="Confirm"
        modal
        footer={deleteCategoryDialogFooter}
        onHide={() => setDeleteCategoryDialog(false)}
      >
        <div className={cx("confirmation-content")}>
          <i
            className="pi pi-exclamation-triangle p-mr-3"
            style={{ fontSize: "2rem", marginRight: "3px" }}
          />
          {Category && (
            <span>
              Are you sure you want to delete <b>{Category.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        className={cx("confirm-delete")}
        visible={deleteCategorysDialog}
        style={{ width: "50rem" }}
        header="Confirm"
        modal
        footer={deleteCategorysDialogFooter}
        onHide={() => setDeleteCategorysDialog(false)}
      >
        <div className={cx("confirmation-content")}>
          <i
            className="pi pi-exclamation-triangle p-mr-3"
            style={{ fontSize: "2rem", marginRight: "3px" }}
          />
          {selectedCategorys.length > 0 && (
            <span>Are you sure you want to delete the selected Categorys?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default Category;
