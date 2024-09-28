//library
import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import classNamesConfig from "classnames/bind";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Image } from "antd";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  AppstoreOutlined,
  SettingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Menu, Input } from "antd";

//class file
import {
  getCategory,
  createCategory,
  deleteCategory as deleteCategoryApi,
  editCategory,
} from "~/services/CategoryService";
import { buildImageUrl } from "~/utils/imageUtils";
import styles from "~/layouts/DefaultLayout/DefaultLayout.module.scss";
const cx = classNamesConfig.bind(styles);

//chuyển đổi một tệp (file) thành chuỗi Base64
//sử dụng FileReader để đọc nội dung của tệp và trả về một promise
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

//validate yup react hook form
const schema = yup
  .object({
    name: yup.string().required("Tên danh mục là bắt buộc!!"),
    image: yup
      .mixed()
      .test("required", "Hình ảnh là bắt buộc!!", function (value) {
        const { oldImage } = this.parent; // ảnh cũ hiện tại
        return value || oldImage; //return lỗi nếu không có ảnh cũ hoặc ảnh mới
      })
      .test(
        "fileType",
        "Hình ảnh phải có định dạng jpeg, png, gif, jpg, ico, webp",
        (value) => {
          // Nếu không có ảnh mới hoặc là ảnh cũ thì không kiểm tra
          if (!value || typeof value === "string") return true;
          return [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/jpg",
            "image/ico",
            "image/webp",
          ].includes(value.type);
        }
      )
      .test(
        "fileSize",
        "Kích thước hình ảnh không được vượt quá 4MB",
        (value) => {
          // Nếu không có ảnh mới hoặc là ảnh cũ thì không kiểm tra
          if (!value || typeof value === "string") return true;
          return value.size <= 4096 * 1024;
        }
      ),
  })
  .required();

function Category() {
  const onClick = (e) => {};
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
  const [CategoryUpdate, setCategoryUpdate] = useState(null);
  const [dialogHeader, setDialogHeader] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const dt = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //hover vào các danh mục của category
  const [isHovered, setIsHovered] = useState(false);
  //nếu bấm new thì modal ko có nút xóa , còn nếu bấm edit thì modal có nút xóa
  const [isEditing, setIsEditing] = useState(false);

  const [DeleteCategory, setDeleteCategory] = useState(null);
  // hàm validate file
  const validateFiles = (files) => {
    //nếu file ko đúng định dạng báo lỗi khi submit
    if (files.length === 0) {
      setError("image", { type: "manual", message: "Hình ảnh là bắt buộc!!" });
      return Promise.reject(new Error("Hình ảnh là bắt buộc!!"));
    }
    //bắt lỗi ngay khi file dc upload lên
    return Promise.all(
      //lặp qua mỗi tệp trong mảng files để xác thực từng tệp
      files.map((file) => {
        return schema.validateAt("image", { image: file }).catch((err) => {
          setError("image", { type: "manual", message: err.message });
          return Promise.reject(err);
        });
      })
    );
  };

  //Hàm withSubmitControl tạo ra một wrapper cho bất kỳ hàm bất đồng bộ nào để kiểm soát việc gửi.
  //Nó ngăn chặn việc gửi lại trong khi một lần gửi đang diễn ra, tránh spam nút submit nào đó liên tục
  const withSubmitControl = (fn) => {
    let isSubmitting = false;
    return async (...args) => {
      if (isSubmitting) return;
      isSubmitting = true;
      try {
        await fn(...args); // Gọi hàm chính
      } finally {
        isSubmitting = false; // Reset cờ sau khi hoàn tất
      }
    };
  };

  //hàm hiển thị file để xem trước
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  //hàm bắt sự thay đổi để validate khi user điền vào form
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
      //console.error("Validation errors:", err);
    }
  };

  //hàm get all list category
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
      // console.log(result);
      const updatedCategorys = await getCategory();
      setCategorys(updatedCategorys);
      // console.log(createCategory(data));
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Category Created",
        life: 3000,
      });
      //sau khi thành công chạy các state dưới đây
      hideDialog(); //ẩn dialog
      reset(); // reset form
      setFileList([]); // set lại input file thành rỗng
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
    // console.log("Calling postCategory");
  };

  //update
  const updateCategory = async (data, id) => {
    try {
      // Nếu có file mới, validate file đó
      if (fileList.length > 0 && fileList[0].originFileObj) {
        await validateFiles(fileList.map((file) => file.originFileObj));
      }

      // Nếu có file mới thì gửi file mới, nếu không giữ lại ảnh cũ
      const newImage =
        fileList.length > 0 && fileList[0].originFileObj
          ? fileList[0].originFileObj
          : null;

      // Gọi editCategory với thông tin cần thiết
      await editCategory(id, { name: data.name, newImage });

      // Cập nhật lại danh sách category sau khi update
      const updatedCategorys = await getCategory();
      // console.log("Updated category list:", updatedCategorys);
      setCategorys(updatedCategorys);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Update Category success!!",
        life: 3000,
      });

      hideDialog();
      setPreviewOpen(false);
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

  //hàm xóa 1 id
  const deleteCategory = async () => {
    if (isSubmitting) return; // Nếu đang submit, bỏ qua
    setIsSubmitting(true); // Vô hiệu hóa nút
    try {
      //import và gọi deleteCategoryApi được export từ CategoryService
      await deleteCategoryApi(Category.id);
      // set lại interface
      setCategorys((prevCategories) =>
        prevCategories.filter((p) => p.id !== Category.id)
      );
      // Close the dialog modal
      setDeleteCategoryDialog(false);
      //đóng modal form edit
      setCategoryDialog(false);
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
    } finally {
      setIsSubmitting(false); // Sau khi xử lý xong, bật lại nút "Yes"
    }
  };

//   // hàm xóa nhiều id
//   const deleteSelectedCategorys = async () => {
//     if (isSubmitting) return; // Nếu đang submit, bỏ qua
//     setIsSubmitting(true); // Vô hiệu hóa nút
//     try {
//       await deleteCategoryAll(selectedCategorys.map((c) => c.id));
//       setCategorys(Categorys.filter((p) => !selectedCategorys.includes(p)));
//       setDeleteCategorysDialog(false);
//       setSelectedCategorys([]);
//       toast.current.show({
//         severity: "success",
//         summary: "Successful",
//         detail: "Categorys Deleted",
//         life: 3000,
//       });
//     } catch (error) {
//       console.error("Failed to deleted categorys:", error);
//       toast.current.show({
//         severity: "error",
//         summary: "Error",
//         detail: "Failed to delete category",
//         life: 3000,
//       });
//     } finally {
//       setIsSubmitting(false); // Sau khi xử lý xong, bật lại nút "Yes"
//     }
//   };
//   const deleteSelectedCategoryWithControl = withSubmitControl(
//     deleteSelectedCategorys
//   );

  //hàm save cho cả post và update
  const saveCategory = async (data) => {
    if (isSubmitting) return; // Nếu đang submit, bỏ qua
    setIsSubmitting(true); // Vô hiệu hóa nút

    try {
      //nếu có id thì chạy hàm update nếu ko có id chạy hàm post new
      if (CategoryUpdate && CategoryUpdate.id) {
        await updateCategory(data, CategoryUpdate.id);
      } else {
        await postCategory(data);
      }
      // Sau khi hoàn thành, bật lại nút
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false); // Bật lại nút nếu có lỗi
    }
  };
  //gán hàm save vào withSubmitControl để xử lý hàm save bị spam gọi lại nhiều lần
  const saveCategoryWithControl = withSubmitControl(saveCategory);

  //hàm mở dialog tạo mới
  const openNew = () => {
    setIsEditing(false);
    setCategoryUpdate(null);
    reset(); // Reset form khi mở dialog
    setFileList([]); // Reset file list về trạng thái trống
    clearErrors();
    setPreviewImage(""); // Reset hình preview về trống
    setPreviewOpen(false); // Đảm bảo không hiển thị modal preview hình
    setCategoryDialog(true);
    setDialogHeader("Tạo mới");
    setCategory({});
  };

  const CategoryCRUD = ({ onClick }) => (
    <div className={cx("labelCategory", "p-0")}>
      <button
        onClick={onClick}
        className={cx("plusButton")}
        title="Tạo mới danh mục"
      >
        <i className="fa-regular fa-square-plus"></i>
      </button>
      <div className={cx("inputContainer")}>
        <Input placeholder="Tìm kiếm..." className={cx("searchInput")} />
        <SearchOutlined className={cx("inputWithIcon")} />
      </div>
    </div>
  );
  const handleMouseEnter = (id) => setIsHovered(id);
  const handleMouseLeave = () => setIsHovered(null);
  const items = [
    {
      key: "sub1",
      label: <span className="fw-semibold">Danh mục</span>,
      children: [
        {
          key: "g1",
          label: <CategoryCRUD onClick={openNew} />,
          type: "group",
          children: Categorys.map((category) => ({
            key: category.id,
            label: (
              <div
                className={cx(
                  "label-text-navigation-list",
                  "d-flex justify-content-between align-items-center"
                )}
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
              >
                <span>{category.name}</span>

                {isHovered === category.id && (
                  <Button
                    title="Cập nhật danh mục"
                    outlined
                    className={cx("button-edit-category")}
                    onClick={() => {
                      openEdit(category);
                      setCategory(category);
                      setCategoryDialog(true);
                    }}
                  >
                    <i className="fa-solid fa-pen"></i>
                  </Button>
                )}
              </div>
            ),
          })),
        },
      ],
    },
    {
      key: "sub2",
      label: "Navigation Two",
      icon: <AppstoreOutlined />,
      children: [
        {
          key: "5",
          label: "Option 5",
        },
        {
          key: "6",
          label: "Option 6",
        },
        {
          key: "sub3",
          label: "Submenu",
          children: [
            {
              key: "7",
              label: "Option 7",
            },
            {
              key: "8",
              label: "Option 8",
            },
          ],
        },
      ],
    },
    {
      type: "divider",
    },
    {
      key: "sub4",
      label: "Navigation Three",
      icon: <SettingOutlined />,
      children: [
        {
          key: "9",
          label: "Option 9",
        },
        {
          key: "10",
          label: "Option 10",
        },
        {
          key: "11",
          label: "Option 11",
        },
        {
          key: "12",
          label: "Option 12",
        },
      ],
    },
  ];

  // hàm mở form edit dialog
  const openEdit = (categoryData) => {
    //dùng để nếu edit thì mới hiện nút xóa
    setIsEditing(true);
    //dùng để truyền data vào nút xóa trong modal edit category
    setDeleteCategory(categoryData);
    //console.log(categoryData);
    // Rải dữ liệu của categoryData vào state để form tự động nhận diện
    setCategoryUpdate(categoryData);
    // Set giá trị mặc định cho form, bao gồm cả name và image
    setValue("name", categoryData.name); // Set tên category vào form
    setValue("image", categoryData.image); // Set ảnh cũ (URL hoặc tên file)
    setFileList([
      {
        uid: "-1", // Unique id
        name: categoryData.image, // Tên file hoặc URL ảnh cũ
        status: "done", // Đánh dấu file đã tải xong
        url: buildImageUrl(categoryData.image_url), // URL hình ảnh hiện tại để load lên xem ảnh
      },
    ]);
    setDialogHeader("Cập nhật"); // Set header cho form modal
    setCategoryDialog(true); // Mở form modal
  };

  //ẩn dialog
  const hideDialog = () => {
    reset();
    clearErrors();
    setCategoryDialog(false);
  };
  //hàm view thông báo xác nhận xóa với 1 id
  const confirmDeleteCategory = (Category) => {
    setCategory(Category);
    setDeleteCategoryDialog(true);
  };

  //nút upload file
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

  //nút save và cancel trong form new and edit
  const CategoryDialogFooter = () => (
    <>
      <Button
        label="Lưu"
        icon="pi pi-save"
        onClick={handleSubmit(saveCategoryWithControl)}
        disabled={isSubmitting}
        className="btn btn-primary py-2 px-4 mx-3"
      />
      <Button
        label="Bỏ qua"
        icon="pi pi-times"
        outlined
        onClick={hideDialog}
        className="btn btn-secondary py-2 px-4 mx-3"
      />
      {isEditing && DeleteCategory && (
        <Button
          label="Xóa"
          icon="pi pi-trash"
          outlined
          severity="danger"
          className="btn btn-danger py-2 px-4 mx-3"
          onClick={() => confirmDeleteCategory(DeleteCategory)}
        />
      )}
    </>
  );

  //nút trong dialog xóa 1 id
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
        disabled={isSubmitting}
      />
    </>
  );

//   //nút trong dialog xóa nhiều id
//   const deleteCategorysDialogFooter = (
//     <>
//       <Button
//         className={cx("dialogFooterButton")}
//         label="No"
//         icon="pi pi-times"
//         outlined
//         onClick={() => setDeleteCategorysDialog(false)}
//       />
//       <Button
//         className={cx("dialogFooterButton")}
//         label="Yes"
//         icon="pi pi-check"
//         severity="danger"
//         onClick={deleteSelectedCategoryWithControl}
//         disabled={isSubmitting}
//       />
//     </>
//   );

  //cột status
//   const statusBodyTemplate = (rowData) => (
//     <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>
//   );
//   const getSeverity = (Category) => {
//     switch (Category.inventoryStatus) {
//       case "INSTOCK":
//         return "success";
//       case "LOWSTOCK":
//         return "warning";
//       case "OUTOFSTOCK":
//         return "danger";
//       default:
//         return null;
//     }
//   };

  //view của primereact
  return (
    <>

      <div className={cx("col-sm-2 pt-4 ")}>
      <Toast ref={toast} />

        <Menu
          className={cx("navigation","w-100")}
          onClick={onClick}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={items}
        />
        <Dialog
          visible={CategoryDialog}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header={dialogHeader}
          modal
          className={cx("p-fluid", "modal-config")}
          footer={CategoryDialogFooter}
          onHide={hideDialog}
        >
          <form onSubmit={handleSubmit(saveCategory)}>
            <div className={cx("field")}>
              <label htmlFor="name" className="font-bold">
                Tên danh mục <span className="text-danger">*</span>
              </label>
              <Controller
                name="name"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <InputText
                    id="name"
                    {...field}
                   
                    className={cx("custom-input",{ "p-invalid": errors.name })}
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
      </div>
    </>
  );
}

export default Category;
