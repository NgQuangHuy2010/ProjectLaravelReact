//library
import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
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
import { useTranslation } from "react-i18next";
//class file
import {
  getCategory,
  createCategory,
  deleteCategory as deleteCategoryApi,
  editCategory,
  findProductsByCategory,
} from "~/services/CategoryService";
import { getProducts } from "~/services/ProductsService";
import { buildImageUrl } from "~/utils/imageUtils";
import styles from "~/layouts/DefaultLayout/DefaultLayout.module.scss";
import { useProducts } from "../Provider/MyProvider";
import DialogFooterForm from "../DialogFooterForm/DialogFooterForm";
import { useFilePreview } from "~/components/PreviewImage/PreviewImage";
import useDebounce from "~/hook/useDebounce";
import { removeVietnameseTones } from "~/helpers/RemoveAccents";

const cx = classNamesConfig.bind(styles);

//validate yup react hook form
const schema = yup
  .object({
    name: yup.string().required("Tên danh mục là bắt buộc!!"),
    image: yup
      .mixed()
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
  //sử dụng preview images import từ component khác
  const {
    previewOpen,
    setPreviewOpen,
    previewImage,
    setPreviewImage,
    handlePreview,
  } = useFilePreview();
  const { t } = useTranslation();
  //provider
  const { setProducts } = useProducts();
  const { setCurrentCategory } = useProducts();
  //
  const [fileList, setFileList] = useState([]);
  const [Categorys, setCategorys] = useState([]);
  const [CategoryDialog, setCategoryDialog] = useState(false);
  const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
  const [Category, setCategory] = useState(null);
  const [CategoryUpdate, setCategoryUpdate] = useState(null);
  const [dialogHeader, setDialogHeader] = useState("");
  const toast = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //hover vào các danh mục của category
  const [isHovered, setIsHovered] = useState(false);
  //nếu bấm new thì modal ko có nút xóa , còn nếu bấm edit thì modal có nút xóa
  const [isEditing, setIsEditing] = useState(false);
  //search category
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef();
  const debounceTerm = useDebounce(searchTerm, 500);
  //
  const [DeleteCategory, setDeleteCategory] = useState(null);
  // hàm validate file
  const validateFiles = (files) => {
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
        summary: t("categoryPage.title-message"),
        detail: t("content-message"),
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
        summary: t("categoryPage.title-message"),
        detail: t("categoryPage.content-message-update"),
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
        summary: t("categoryPage.title-message"),
        detail: "Category Deleted",
        life: 3000,
      });
    } catch (error) {
      // lấy phản hồi  "message" từ api xuống để thông báo lỗi lên giao diện
      const errorMessage =
        error?.response?.data?.message || "Không thể xóa danh mục";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
      });
    } finally {
      setIsSubmitting(false); // Sau khi xử lý xong, bật lại nút "Yes"
    }
  };

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
    setDialogHeader(t("categoryPage.title-modal-create"));
    setCategory({});
  };
  const handleCategoryClick = async (categoryId) => {
    //console.log(`Clicked category ID: ${categoryId}`);

    try {
      const result = await findProductsByCategory(categoryId);
      //console.log('API Response:', result); // In ra toàn bộ phản hồi từ API
      setProducts(result);
      setCurrentCategory(categoryId);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleCategoryAllClick = async () => {
    try {
      const allProducts = await getProducts();
      setProducts(allProducts);
      setCurrentCategory(null);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  // // Hàm xử lý sự kiện thay đổi từ khóa tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    //neu ng dùng  nhập khoảng trắng vào tìm kiếm thì ko cho nhập
    if (value.startsWith(" ")) {
      return;
    }
    setSearchTerm(value);
  };
  // // Hàm xóa từ khóa tìm kiếm và hiển thị lại tất cả danh mục
  const handleClearSearch = () => {
    setSearchTerm("");
    //inputRef.current.focus();
  };
  // // Hàm lọc danh mục dựa trên từ khóa tìm kiếm
  const filteredCategories = Categorys.filter((category) =>
    removeVietnameseTones(category.name).includes(
      removeVietnameseTones(debounceTerm)
    )
  );

  const CategoryCRUD = ({ onClick, onSearchChange, onClearSearch }) => (
    <div className={cx("labelCategory", "p-0")}>
      <button
        onClick={onClick}
        className={cx("plusButton")}
        title={t("categoryPage.title-button-create")}
      >
        <i className="fa-regular fa-square-plus"></i>
      </button>
      <div className={cx("inputContainer")}>
        <Input
          autoFocus
          placeholder={t("categoryPage.placeholder")}
          ref={inputRef}
          className={cx("searchInput")}
          onChange={onSearchChange}
          value={searchTerm}
          // onFocus={() => inputRef.current.focus()}
        />
        <SearchOutlined className={cx("inputWithIcon")} />
        {searchTerm && (
          <button
            className={cx("inputWithIcon")}
            onClick={onClearSearch}
            title="Xóa tìm kiếm"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
    </div>
  );

  // Hàm handle mouse enter/leave
  const handleMouseEnter = (id) => setIsHovered(id);
  const handleMouseLeave = () => setIsHovered(null);

  const items = [
    {
      key: "sub1",
      label: (
        <span className="fw-semibold">{t("categoryPage.title-menu")}</span>
      ),
      children: [
        {
          key: "all",
          label: (
            <div
              className={cx(
                "label-text-navigation-list",
                "d-flex align-items-center"
              )}
              onMouseEnter={() => handleMouseEnter("all")}
              onMouseLeave={handleMouseLeave}
              onClick={handleCategoryAllClick}
            >
              <span className="fw-bold">
                {t("categoryPage.list-category-all")}
              </span>
            </div>
          ),
        },
        {
          key: "g1",
          label: (
            <CategoryCRUD
              onClick={openNew}
              onSearchChange={handleSearchChange}
              onClearSearch={handleClearSearch}
            />
          ),
          type: "group",
          children: filteredCategories.map((category) => ({
            key: `category-${category.id}`,
            label: (
              <div
                className={cx(
                  "label-text-navigation-list",
                  "d-flex justify-content-between align-items-center"
                )}
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleCategoryClick(category.id)}
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
    setDialogHeader(t("categoryPage.title-modal-update")); // Set header cho form modal
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
        {t("categoryPage.buton-modal-upload")}
      </div>
    </button>
  );
  //nút save và cancel trong form new and edit
  const CategoryDialogFooter = () => (
    <>
      <Button
        label={t("categoryPage.footerButon-modal-save")}
        icon="pi pi-save"
        onClick={handleSubmit(saveCategoryWithControl)}
        disabled={isSubmitting}
        className="btn btn-primary py-2 px-4 mx-3"
      />
      <Button
        label={t("categoryPage.footerButon-modal-cancel")}
        icon="pi pi-times"
        outlined
        onClick={hideDialog}
        className="btn btn-secondary py-2 px-4 mx-3"
      />
      {isEditing && DeleteCategory && (
        <Button
          label={t("categoryPage.footerButon-modal-delete")}
          icon="pi pi-trash"
          outlined
          severity="danger"
          className="btn btn-danger py-2 px-4 mx-3"
          onClick={() => confirmDeleteCategory(DeleteCategory)}
        />
      )}
    </>
  );

  //view của primereact
  return (
    <>
      <div className={cx("col-sm-2 pt-4 ")}>
        <Toast ref={toast} />

        <Menu
          className={cx("navigation", "w-100")}
          onClick={onClick}
          defaultSelectedKeys={["all"]}
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
                {t("categoryPage.label-name-modal")}{" "}
                <span className="text-danger">*</span>
              </label>
              <Controller
                name="name"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <InputText
                    id="name"
                    {...field}
                    className={cx("custom-input", { "p-invalid": errors.name })}
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
          header={t("categoryPage.title-confirm-modal-delete")}
          modal
          footer={
            <DialogFooterForm
              onConfirm={deleteCategory} // Hàm xác nhận xóa
              onCancel={() => setDeleteCategoryDialog(false)} // Hàm hủy bỏ
              isSubmitting={isSubmitting} // Trạng thái nút khi submit
            />
          }
          onHide={() => setDeleteCategoryDialog(false)}
        >
          <div className={cx("confirmation-content")}>
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem", marginRight: "3px" }}
            />
            {Category && (
              <span>
                {t("categoryPage.content-confirm-modal-delete")}{" "}
                <b>{Category.name}</b>?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </>
  );
}

export default Category;
