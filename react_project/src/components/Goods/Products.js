//library
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
import { InputNumber } from "primereact/inputnumber";
import { Tag } from "primereact/tag";
import classNamesConfig from "classnames/bind";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Image } from "antd";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Select } from "antd";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

//class file
import DialogFooterForm from "../DialogFooterForm/DialogFooterForm";
import ToolbarButtons from "~/components/ToolbarButtons/ToolbarButtons";
import {
  getCategory,
  findProductsByCategory,
} from "~/services/CategoryService";
import {
  getProducts,
  createProducts,
  deleteProducts as deleteProductsApi,
  deleteProductsAll,
  editProducts,
  checkProductModel,
} from "~/services/ProductsService";
import MyEditor from "~/components/CKEditor/CKEditor";
import HeaderItem from "~/components/HeaderItemDialogModal/HeaderItemModal";
import { buildImageUrl } from "~/utils/imageUtils";
import styles from "~/layouts/DefaultLayout/DefaultLayout.module.scss";

import { useProducts } from "../Provider/MyProvider";
const cx = classNamesConfig.bind(styles);
const { Option } = Select;

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
    name_product: yup
      .string()
      .required("Vui lòng nhập Tên sản phẩm trước khi lưu!!"),
    product_model: yup
      .string()
      .test("is-unique", "Mã sản phẩm đã tồn tại", async (value, context) => {
        const { productModelCurrent } = context.parent; // Lấy product_model hiện tại từ context

        if (value === productModelCurrent) return true;
        if (!value) return true;
        const isUnique = await checkProductModel(value);
        return isUnique; // Trả về true nếu duy nhất, false nếu không
      }),
    idCategory: yup
      .number()
      .required("Vui lòng chọn danh mục!!")
      .typeError("idCategory must be an integer")
      .integer("idCategory must be an integer")
      .positive("idCategory must be a positive integer"),

    image: yup
      .mixed()
      .nullable()
      .test(
        "fileType",
        "Hình ảnh phải có định dạng jpeg, png, gif, jpg, ico, webp",
        (value) => {
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
          if (!value || typeof value === "string") return true;
          return value.size <= 4096 * 1024;
        }
      ),
    images: yup.array().of(
      yup
        .mixed()
        .nullable()
        .test(
          "fileType",
          "Hình ảnh phải có định dạng jpeg, png, gif, jpg, ico, webp",
          (value) => {
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
            if (!value || typeof value === "string") return true;
            return value.size <= 4096 * 1024;
          }
        )
    ),
  })
  .required();

function Products() {
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
  const [multipleFileList, setMultipleFileList] = useState([]);
  const [Products, setProducts] = useState([]);
  const [ProductsDialog, setProductsDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [deleteProductsMultipleDialog, setDeleteProductsMultipleDialog] =
    useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [Product, setProduct] = useState(null);
  const [ProductUpdate, setProductUpdate] = useState(null);
  const [dialogHeader, setDialogHeader] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const dt = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //set mặc định hiển thị là form điền thông tin
  const [activeForm, setActiveForm] = useState("info");
  //lưu lai content khi điền vào form editor mà chuyển qua header khác ko bị mất content đó
  const [editorContent, setEditorContent] = useState("");
  //lấy danh sách danh mục
  const [Categorys, setCategorys] = useState([]);
  //state xử lý lấy tên file ảnh cần xóa
  const [imagesToRemove, setImagesToRemove] = useState([]);
  //thay đổi giá sang VNĐ
  const [priceProduct, setPriceProduct] = useState("");
  const [priceDiscount, setPriceDiscount] = useState("");
  //// Lấy products từ context , lấy từ contexxt fetch ra data của danh mục dc chọn
  const { products: contextProducts, currentCategory } = useProducts();

  //header form data
  const renderHeader = (
    <div className="d-flex">
      <HeaderItem
        label="Thông tin"
        activeForm={activeForm}
        setActiveForm={setActiveForm}
        activeFormValue="info"
      />
      <div className="mx-5">
        <HeaderItem
          label="Mô tả chi tiết"
          activeForm={activeForm}
          setActiveForm={setActiveForm}
          activeFormValue="details"
        />
      </div>
    </div>
  );
  // hàm validate file
  const validateFiles = async (files, field) => {
    const validationSchema =
      field === "image" ? schema.pick(["image"]) : schema.pick(["images"]);

    const errors = [];

    // Validate each file if it's an array (for "images")
    if (field === "images" && Array.isArray(files)) {
      // Loop through each file for validation
      for (const file of files) {
        try {
          // Validate each file individually
          await validationSchema.validate({ [field]: [file] });
        } catch (err) {
          // If there are errors, push the message to the errors array
          errors.push(err.message);
        }
      }
    } else {
      // If it's a single file (for "image"), validate normally
      try {
        await validationSchema.validate({ [field]: files });
      } catch (err) {
        errors.push(err.message);
      }
    }

    // If there are errors, set them and return false
    if (errors.length > 0) {
      setError(field, { type: "manual", message: errors.join(", ") });
      return false; // Return false to indicate validation failure
    }

    // If no errors, return true
    return true;
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

  // Hàm bắt sự thay đổi để validate khi user điền vào form
  const handleChange = async ({ fileList: newFileList }) => {
    //console.log("New file list:", newFileList); // Check fileList có lấy dc file chưa

    // Update file list
    setFileList(newFileList);
    // Clear previous errors
    clearErrors("image");

    // Validate files immediately
    try {
      await validateFiles(
        newFileList[0] ? newFileList[0].originFileObj : null,
        "image"
      ); // Validate single file
      // Update the form value with the first file if available
      setValue("image", newFileList[0]?.originFileObj || null);
    } catch (err) {
      // Handle validation errors if any
      console.error("Validation errors:", err);
    }
  };

  // mặc định là tối đa 5 ảnh
  const MAX_FILES = 5;
  const handleMultipleChange = async ({ fileList: newFileList }) => {
    // Giới hạn số lượng file tải lên
    if (newFileList.length > MAX_FILES) {
      newFileList = newFileList.slice(0, MAX_FILES);
    }

    setMultipleFileList(newFileList); // Cập nhật danh sách file hiển thị

    // Xóa lỗi liên quan đến images nếu có
    clearErrors("images");

    try {
      const filesToValidate = newFileList
        // Chỉ xác thực file mới được upload lên
        .filter((file) => file.originFileObj)
        .map((file) => file.originFileObj);

      // Xác thực các file mới
      if (filesToValidate.length > 0) {
        await validateFiles(filesToValidate, "images");
      }

      // Tạo một mảng chứa cả file mới (File) và ảnh cũ (chuỗi tên file)
      const images = newFileList.map((file) => file.originFileObj || file.name);
      // Set giá trị cho key "images", bao gồm cả file mới và ảnh cũ
      setValue("images", images);
    } catch (err) {
      console.error("Validation errors:", err);
    }
  };

  const handleRemoveImage = (file) => {
    // Log hình ảnh đang xóa
    // console.log("Bắt đầu xử lý xóa hình ảnh:", file);
    // Cập nhật danh sách file
    setMultipleFileList((prevState) => {
      // Lọc ra hình ảnh cần xóa
      const newFileList = prevState.filter((item) => item.uid !== file.uid);
      //console.log("Danh sách ảnh sau khi xóa:", newFileList); // Log danh sách ảnh sau khi xóa
      // Cập nhật lại UID cho danh sách mới
      const updatedFileList = newFileList.map((item, index) => ({
        ...item,
        uid: index + 1, // Cập nhật UID từ 1 trở đi
      }));
      // Cập nhật giá trị cho trường "images"
      const fileNames = updatedFileList.map((item) => item.name);
      // console.log("Tên file sau khi cập nhật:", fileNames);
      setValue("images", fileNames);
      // Log giá trị images sau khi cập nhật
      //console.log("Giá trị images sau khi cập nhật:", fileNames);
      return updatedFileList; // Trả về danh sách mới với UID đã cập nhật
    });

    // Cập nhật hình ảnh cần xóa
    setImagesToRemove((prev) => [...prev, file]);
    //console.log("Danh sách hình ảnh cần xóa:", imagesToRemove);
  };

  //hàm get all list category
  const fetchDataCategory = async () => {
    try {
      const data = await getCategory();
      setCategorys(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // useEffect để fetch danh mục khi trang được load lần đầu
  useEffect(() => {
    fetchDataCategory();
  }, []);
  //hàm get all list product
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        //console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  //hàm theo dõi danh mục hiện tại để khi thêm hay sửa 1 sản phẩm nó
  //vẫn đứng im ở danh mục hiện tại được chọn mà ko bị load lại tất cả
  //và tiếp tục kiểm tra và set lại trong hàm post và update
  useEffect(() => {
    if (currentCategory) {
      const fetchCategoryProducts = async () => {
        const categoryProducts = await findProductsByCategory(currentCategory);
        setProducts(categoryProducts);
      };

      fetchCategoryProducts();
    }
  }, [currentCategory]);

  //lấy ra danh sách sản phẩm đang đc chọn từ category.js đến provider
  //và dùng contextProducts load ra
  useEffect(() => {
    if (contextProducts.length > 0) {
      // Cập nhật danh sách sản phẩm từ context
      setProducts(contextProducts);
    }
  }, [contextProducts]);

  //post
  const postProduct = async (data) => {
    console.log("Submitted data:", data);
    try {
      await validateFiles(fileList.map((file) => file.originFileObj));
      await validateFiles(
        multipleFileList.map((file) => file.originFileObj),
        "images"
      );
      const newProduct = await createProducts(data);
      const updatedProducts = currentCategory 
      ? await findProductsByCategory(currentCategory)  // Nếu đang chọn danh mục
      : [...contextProducts, newProduct];              // Nếu không có danh mục nào chọn

    setProducts(updatedProducts);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Tạo mới thành công ",
        life: 3000,  
      });
      //sau khi thành công chạy các state dưới đây
      hideDialog(); //ẩn dialog
      reset(); // reset form
      setFileList([]); // set lại input file thành rỗng
      setMultipleFileList([]); //set lại input chọn hình chi tiết thành rỗng
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

  //update
  const updateProduct = async (data, id) => {
    // console.log("Dữ liệu trước khi gửi:", data);
    try {
      // Nếu có file mới, validate file đó
      if (fileList.length > 0 && fileList[0].originFileObj) {
        await validateFiles(fileList.map((file) => file.originFileObj));
      }
      const newImage =
        fileList.length > 0 && fileList[0].originFileObj
          ? fileList[0].originFileObj
          : null; // Giữ lại giá trị cũ nếu không có file mới
      //fil console.log("update image",newImage);
      //console.log("Multiple file list:", multipleFileList);

      const fileArray = [];
      if (multipleFileList.length > 0) {
        await validateFiles(multipleFileList.map((file) => file.originFileObj)); // validate tất cả file
        fileArray.push(
          ...multipleFileList.map((file) => file.originFileObj).filter(Boolean)
        ); // chỉ lấy các file hợp lệ
      }

      //console.log("iamges to remove" , imagesToRemove);

      // Gọi editCategory với thông tin cần thiết
      await editProducts(id, {
        name_product: data.name_product,
        // image: data.image,
        newImage,
        images: fileArray,
        imagesToRemove,
        idCategory: data.idCategory,
        product_model: data.product_model,
        origin: data.origin,
        price_product: data.price_product,
        discount: data.discount,
        description: data.description,
      });

      // Cập nhật lại danh sách category sau khi update
      const updatedCategorys = await getProducts();
      // console.log("Updated category list:", updatedCategorys);
      setProducts(updatedCategorys);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Cập nhật sản phẩm thành công!!",
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
      await deleteProductsApi(Product.id);
      // set lại interface
      setProducts((prevCategories) =>
        prevCategories.filter((p) => p.id !== Product.id)
      );
      // Close the dialog modal
      setDeleteProductsDialog(false);
      //đóng modal form edit
      setProductsDialog(false);
      // Show success toast
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Xóa sản phẩm thành công !!",
        life: 3000,
      });
    } catch (error) {
      // Handle the error and show error toast
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

  // hàm xóa nhiều id
  const deleteSelectedProducts = async () => {
    if (isSubmitting) return; // Nếu đang submit, bỏ qua
    setIsSubmitting(true); // Vô hiệu hóa nút
    try {
      await deleteProductsAll(selectedProducts.map((c) => c.id));
      setProducts(Products.filter((p) => !selectedProducts.includes(p)));
      setDeleteProductsMultipleDialog(false);
      setSelectedProducts([]);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Xóa danh sách sản phẩm đã chọn thành công !!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Lỗi khi xóa sản phẩm !!",
        life: 3000,
      });
    } finally {
      setIsSubmitting(false); // Sau khi xử lý xong, bật lại nút "Yes"
    }
  };

  const deleteSelectedProductsWithControl = withSubmitControl(
    deleteSelectedProducts
  );

  //hàm save cho cả post và update
  const saveProducts = async (data) => {
    if (isSubmitting) return; // Nếu đang submit, bỏ qua
    setIsSubmitting(true); // Vô hiệu hóa nút

    try {
      //nếu có id thì chạy hàm update nếu ko có id chạy hàm post new
      if (ProductUpdate && ProductUpdate.id) {
        await updateProduct(data, ProductUpdate.id);
      } else {
        await postProduct(data);
      }
      // Sau khi hoàn thành, bật lại nút
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false); // Bật lại nút nếu có lỗi
    }
  };
  //gán hàm save vào withSubmitControl để xử lý hàm save bị spam gọi lại nhiều lần
  const saveCategoryWithControl = withSubmitControl(saveProducts);

  //hàm mở dialog tạo mới
  const openNew = () => {
    setProductUpdate(null);
    reset(); // Reset form khi mở dialog
    setFileList([]); // Reset file list về trạng thái trống
    setMultipleFileList([]); //set lại hình chi tiết về rỗng
    clearErrors();
    setPreviewImage(""); // Reset hình preview về trống
    setPreviewOpen(false); // Đảm bảo không hiển thị modal preview hình
    setProductsDialog(true);
    setDialogHeader("Tạo mới");
    setProduct({});
    setPriceProduct("");
    setPriceDiscount("");
    setActiveForm("info"); // Luôn đặt activeForm về "info" khi mở dialog
    fetchDataCategory();
  };

  // Hàm mở form edit dialog
  const openEdit = (ProductData) => {
    // Rải dữ liệu vào state để form tự động nhận diện
    setProductUpdate(ProductData);
    //console.log("data", ProductData);
    // Set giá trị mặc định cho form, bao gồm các trường như name, image, price, description, v.v.
    setValue("name_product", ProductData.name_product || ""); // Nếu null, gán chuỗi rỗng
    setValue("price_product", ProductData.price_product || 0); // Nếu null, gán giá trị 0
    setValue("discount", ProductData.discount || 0);
    setValue("description", ProductData.description || "");
    setValue("origin", ProductData.origin || "");
    setValue("idCategory", ProductData.idCategory || null);
    setValue("product_model", ProductData.product_model || "");
    setValue("productModelCurrent", ProductData.product_model || "");
    setValue("image", ProductData.image || "");
    setFileList([
      {
        uid: "-1", // Unique id
        name: ProductData.image, // Tên file hoặc URL ảnh cũ
        status: "done", // Đánh dấu file đã tải xong
        url: buildImageUrl(ProductData.image_url), // URL hình ảnh hiện tại để load lên xem ảnh
      },
    ]);
    // Xử lý hình ảnh bổ sung
    if (ProductData.images_url.length > 0) {
      const imageFiles = ProductData.images_url.map((imageUrl, index) => ({
        uid: index + 1, // Tạo uid duy nhất cho mỗi hình ảnh
        name: imageUrl.split("/").pop(), // Lấy tên file từ URL
        status: "done", // Đánh dấu file đã tải xong
        url: buildImageUrl(imageUrl), // URL hình ảnh hiện tại để load lên xem ảnh
      }));

      setMultipleFileList(imageFiles); // Cập nhật danh sách file cho images
      setValue(
        "images",
        imageFiles.map((file) => file.name)
      ); // Cập nhật giá trị cho trường images
    } else {
      // Nếu không có hình ảnh, đặt multipleFileList thành mảng rỗng
      setMultipleFileList([]);
      // Đặt trường images thành mảng rỗng
      setValue("images", []);
    }
    if (ProductData.image_url === "/file/img/img_default/default-product.png") {
      setFileList([]);
    }
    setDialogHeader("Cập nhật"); // Set header cho form modal
    setProductsDialog(true); // Mở form modal
    setActiveForm("info"); // Luôn đặt activeForm về "info" khi mở dialog
  };

  //ẩn dialog
  const hideDialog = () => {
    reset();
    clearErrors();
    setProductsDialog(false);
    setEditorContent("");
  };
  //hàm view thông báo xác nhận xóa với 1 id
  const confirmDeleteCategory = (Product) => {
    setProduct(Product);
    setDeleteProductsDialog(true);
  };
  //hàm view thông báo xác nhận xóa với nhiều id
  const confirmDeleteSelected = () => {
    setDeleteProductsMultipleDialog(true);
  };

  // gọi hàm để giá trong data table chuyển đổi
  const priceProductBodyTemplate = (rowData) => {
    return formatCurrency(rowData.price_product);
  };
  const discountBodyTemplate = (rowData) => {
    return formatCurrency(rowData.discount);
  };

  //thay đổi giá trong input
  const ChangeDiscount = (e, name) => {
    const val = e.value || 0;
    let _price = { ...priceDiscount };

    _price[`${name}`] = val;

    setPriceDiscount(_price);
  };
  const ChangePriceProduct = (e, name) => {
    const val = e.value || 0;
    let _price = { ...priceProduct };

    _price[`${name}`] = val;

    setPriceProduct(_price);
  };
  //format lại gía tiền để hiển thị ra view datatable
  const formatCurrency = (value) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(numericValue);
    }
    return "";
  };
  //hàm search value trong data table
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
  const handleExportCSV = () => {
    if (dt.current) {
      dt.current.exportCSV(); // Call export function
    }
  };

  // Nút cập nhật và xóa datatable
  const actionBodyTemplate = (rowData) => (
    <>
      <div className="dropdown ">
        <button
          className="btn btn-light btn-lg dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Action
        </button>
        <ul className="dropdown-menu p-1">
          <li
            className={cx(
              "dropdown-item d-flex align-items-center ",
              "custom-dropdown"
            )}
          >
            <Button
              icon="pi pi-pencil"
              outlined
              className={cx("mr-2", "button-dropdown")}
              onClick={() => {
                openEdit(rowData);
                setProduct(rowData);
                setProductsDialog(true);
              }}
            >
              <span className="mx-5 text-dark ">Edit</span>
            </Button>
          </li>
          <li
            className={cx(
              "dropdown-item d-flex align-items-center ",
              "custom-dropdown"
            )}
          >
            <Button
              icon="pi pi-trash"
              rounded
              outlined
              severity="danger"
              className={cx("mr-2", "button-dropdown")}
              onClick={() => confirmDeleteCategory(rowData)}
            >
              <span className="mx-5  text-dark">Delete</span>
            </Button>
          </li>
        </ul>
      </div>
    </>
  );

  //nút save và cancel trong form new and edit
  const ButtonSaveandCancelDialog = () => (
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
    </>
  );

  //hàm hiện thông báo
  const statusBodyTemplate = (rowData) => (
    <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>
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

  // ảnh hiện trong data table láy từ buildImageUrl
  const imageBodyTemplate = (rowData) => {
    const imageUrl = buildImageUrl(rowData.image_url);

    return (
      <img
        src={imageUrl}
        alt={rowData.name}
        className={cx("image-body-datatable")}
      />
    );
  };

  return (
    <div className="col-sm-10">
      <Toolbar
        style={{
          backgroundColor: "transparent",
          border: "none",
          display: "flex",
          justifyContent: "end",
        }}
        className="mb-4"
        right={() => (
          <ToolbarButtons
            selectedProducts={selectedProducts}
            confirmDeleteSelected={confirmDeleteSelected}
            openNew={openNew}
            exportCSV={handleExportCSV}
            deleteLabel="Xóa sản phẩm" // Explicit label
            createLabel="Tạo mới sản phẩm" // Explicit label
            exportLabel="Export CSV" // Explicit label
          />
        )}
      />
      <div className={cx("dataTable-config")}>
        <Toast ref={toast} />
        <div className={cx("card")}>
          <DataTable
            className={cx("text-dataTable")}
            ref={dt}
            value={Products}
            selection={selectedProducts}
            onSelectionChange={(e) => setSelectedProducts(e.value)}
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
              style={{ minWidth: "8rem" }}
            />

            <Column
              field="product_model"
              sortable
              header="Mã hàng"
              body={(rowData) => (
                <div className=" d-flex align-items-center">
                  {/* Hiển thị hình ảnh bằng imageBodyTemplate */}
                  {imageBodyTemplate(rowData)}
                  <span className="px-3">{rowData.product_model}</span>
                </div>
              )}
              style={{ minWidth: "16rem" }}
            />

            <Column
              field="name_product"
              header="Tên hàng"
              sortable
              style={{ minWidth: "16rem" }}
            />
            <Column
              field="discount"
              header="Giá bán"
              body={discountBodyTemplate}
              sortable
              style={{ minWidth: "16rem" }}
            />
            <Column
              field="price_product"
              header="Giá vốn"
              body={priceProductBodyTemplate}
              sortable
              style={{ minWidth: "16rem" }}
            />
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
          visible={ProductsDialog}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header={dialogHeader}
          modal
          className={cx("p-fluid", "modal-config-addProduct")}
          footer={ButtonSaveandCancelDialog}
          onHide={hideDialog}
        >
          <form onSubmit={handleSubmit(saveProducts)} className="row gx-5">
            <div className="py-3">{renderHeader}</div>
            {activeForm === "info" ? (
              // Cột bên trái
              <>
                <div className="col-md-8">
                  <div className={cx("field", "row align-items-center")}>
                    <div className="col-sm-3">
                      <label htmlFor="product_model" className="fw-bold fs-5">
                        Mã hàng
                      </label>
                      <Tippy
                        content="Mã hàng là thông tin duy nhất"
                        placement="right"
                        className={cx("tippy-tooltip")}
                      >
                        <span className="px-3">
                          <i className="fa-solid fa-circle-info"></i>
                        </span>
                      </Tippy>
                    </div>
                    <div className="col-sm-9">
                      <Controller
                        name="product_model"
                        defaultValue="" // Tên hàng để trống
                        control={control}
                        render={({ field }) => (
                          <InputText
                            placeholder="Mã hàng tự động"
                            id="product_model"
                            {...field}
                            className={cx("custom-input", {
                              "p-invalid": errors.product_model,
                            })}
                          />
                        )}
                      />
                      {errors.product_model && (
                        <small className="p-error">
                          {errors.product_model.message}
                        </small>
                      )}
                    </div>
                  </div>

                  <div className={cx("field", "row align-items-center")}>
                    <div className="col-sm-3">
                      <label htmlFor="name_product" className="fw-bold fs-5">
                        Tên sản phẩm <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div className="col-sm-9">
                      <Controller
                        name="name_product"
                        defaultValue="" // Tên hàng để trống
                        control={control}
                        render={({ field }) => (
                          <InputText
                            id="name_product"
                            {...field}
                            className={cx("custom-input", {
                              "p-invalid": errors.name_product,
                            })}
                          />
                        )}
                      />
                      {errors.name_product && (
                        <small className="p-error">
                          {errors.name_product.message}
                        </small>
                      )}
                    </div>
                  </div>

                  <div className={cx("field", " mt-4 row align-items-center")}>
                    <div className="col-sm-3">
                      <label htmlFor="idCategory" className="fw-bold fs-5">
                        Danh mục <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div className="col-sm-9">
                      <Controller
                        name="idCategory"
                        control={control}
                        render={({ field }) => (
                          <Select
                            id="idCategory"
                            {...field}
                            value={field.value || null} // Giá trị cần là số nguyên
                            className="w-100"
                            placeholder="---Chọn danh mục---"
                            onChange={(value) => {
                              field.onChange(Number(value)); // Gửi giá trị trực tiếp (số nguyên) từ Select
                            }}
                          >
                            {Categorys.map((category) => (
                              <Option key={category.id} value={category.id}>
                                {category.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      />

                      {errors.idCategory && (
                        <small className="p-error">
                          {errors.idCategory.message}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className={cx("field", "row align-items-center")}>
                    <div className="col-sm-3">
                      <label htmlFor="origin" className="fw-bold fs-5">
                        Nguồn gốc
                      </label>
                    </div>
                    <div className="col-sm-9">
                      <Controller
                        name="origin"
                        defaultValue="" // Tên hàng để trống
                        control={control}
                        render={({ field }) => (
                          <InputText
                            id="origin"
                            {...field}
                            className={cx("custom-input", {
                              "p-invalid": errors.origin,
                            })}
                          />
                        )}
                      />
                      {errors.origin && (
                        <small className="p-error">
                          {errors.origin.message}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cột bên phải */}
                <div className="col-md-4">
                  <div className="row">
                    <div className={cx("field", "row align-items-center")}>
                      <div className="col-sm-3">
                        <label htmlFor="price" className="fw-bold fs-5">
                          Giá vốn
                        </label>
                      </div>
                      <div className="col-sm-9">
                        <Controller
                          name="price_product"
                          defaultValue=""
                          control={control}
                          render={({ field }) => (
                            <InputNumber
                              value={field.value || priceProduct.price_product}
                              onValueChange={(e) => {
                                const val = e.value || 0; // Lấy giá trị từ sự kiện
                                field.onChange(val); // Cập nhật giá trị cho control
                                ChangePriceProduct(e, "price_product"); // Gọi hàm xử lý thay đổi giá trị
                              }}
                              mode="currency"
                              currency="VND"
                              locale="vi-VN"
                              className={cx("custom-input", {
                                "p-invalid": errors.price_product,
                              })}
                            />
                          )}
                        />
                      </div>
                      {errors.price && (
                        <small className="p-error">
                          {errors.price.message}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className={cx("field", "mt-3 row align-items-center")}>
                    <div className="col-sm-3">
                      <label htmlFor="discount" className="fw-bold fs-5">
                        Giá bán
                      </label>
                    </div>
                    <div className="col-sm-9">
                      <Controller
                        name="discount"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <InputNumber
                            value={field.value || priceDiscount.discount}
                            onValueChange={(e) => {
                              const val = e.value || 0; // Lấy giá trị từ sự kiện
                              field.onChange(val); // Cập nhật giá trị cho control
                              ChangeDiscount(e, "discount"); // Gọi hàm xử lý thay đổi giá trị
                            }}
                            mode="currency"
                            currency="VND"
                            locale="vi-VN"
                            className={cx("custom-input", {
                              "p-invalid": errors.discount,
                            })}
                          />
                        )}
                      />
                      {errors.discount && (
                        <small className="p-error">
                          {errors.discount.message}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-5 ">
                  <div className={cx("field", "mb-3 px-3")}>
                    <label htmlFor="" className="py-3 fw-bold fs-5">
                      Hình chính
                    </label>
                    <Controller
                      name="image"
                      control={control}
                      render={({
                        field: { onChange, onBlur, value, name, ref },
                      }) => (
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
                        afterOpenChange: (visible) =>
                          !visible && setPreviewImage(""),
                      }}
                      src={previewImage}
                    />
                  )}
                </div>

                <div className="col-md-7">
                  <div className={cx("field", "mb-3")}>
                    <label htmlFor="" className="py-3 fw-bold fs-5">
                      Hình chi tiết
                    </label>
                    <>
                      <Tippy
                        content="Chỉ được upload tối đa 5 tấm hình"
                        placement="right"
                        className={cx("tippy-tooltip")}
                      >
                        <span className="px-3">
                          <i className="fa-solid fa-circle-info"></i>
                        </span>
                      </Tippy>
                    </>
                    <Controller
                      name="images"
                      control={control}
                      render={({
                        field: { onChange, onBlur, value, name, ref },
                      }) => (
                        <Upload
                          listType="picture-card"
                          fileList={multipleFileList}
                          onPreview={handlePreview}
                          onChange={handleMultipleChange}
                          onRemove={handleRemoveImage}
                          customRequest={({ file, onSuccess }) => {
                            onSuccess(file);
                          }}
                          beforeUpload={() => false} // Disable auto upload
                          accept="images/*"
                          multiple={true}
                        >
                          {multipleFileList.length >= MAX_FILES
                            ? null
                            : uploadButton}
                        </Upload>
                      )}
                    />
                    {errors.images && (
                      <small className="p-error">{errors.images.message}</small>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Controller
                  name="description" // Đây sẽ là tên trường để gửi lên server
                  control={control}
                  defaultValue={editorContent} // Giá trị mặc định
                  render={({ field: { onChange, onBlur, value } }) => (
                    <MyEditor
                      editorContent={value} // Gán giá trị từ field vào editor
                      setEditorContent={(content) => {
                        onChange(content); // Cập nhật giá trị khi editor thay đổi
                        setEditorContent(content);
                      }}
                    />
                  )}
                />
              </>
            )}
          </form>
        </Dialog>

        <Dialog
          className={cx("confirm-delete")}
          visible={deleteProductsDialog}
          style={{ width: "50rem" }}
          header="Xóa hàng hóa"
          modal
          footer={
            <DialogFooterForm
              onConfirm={deleteCategory} // Hàm xác nhận xóa
              onCancel={() => setDeleteProductsDialog(false)} // Hàm hủy bỏ
              isSubmitting={isSubmitting} // Trạng thái nút khi submit
            />
          }
          onHide={() => setDeleteProductsDialog(false)}
        >
          <div className={cx("confirmation-content")}>
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{
                fontSize: "3rem",
                marginRight: "10px",
                color: "#FFCC00",
              }}
            />
            {Product && (
              <span>
                Bạn có chắc chắn muốn xóa sản phẩm <b>{Product.name_product}</b>{" "}
                với mã hàng <b>{Product.product_model}</b>?
              </span>
            )}
          </div>
        </Dialog>

        <Dialog
          className={cx("confirm-delete")}
          visible={deleteProductsMultipleDialog}
          style={{ width: "50rem" }}
          header="Xóa hàng hóa"
          modal
          footer={
            <DialogFooterForm
              onConfirm={deleteSelectedProductsWithControl} // Hàm xác nhận xóa nhiều sản phẩm
              onCancel={() => setDeleteProductsMultipleDialog(false)} // Hàm hủy bỏ
              isSubmitting={isSubmitting} // Trạng thái nút khi submit
            />
          }
          onHide={() => setDeleteProductsMultipleDialog(false)}
        >
          <div className={cx("confirmation-content")}>
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "3rem", marginRight: "3px", color: "#FFCC00" }}
            />
            {selectedProducts.length > 0 && (
              <span>
                Bạn có chắc muốn <b>xóa toàn bộ</b> danh sách được chọn ?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default Products;
