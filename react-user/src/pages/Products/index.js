import { useEffect, useState } from "react";
import { getProductsByCategory } from "~/services/productServices";
import { useLocation } from "react-router-dom";
import ProductCard from "~/components/ProductCard/ProductCard";

function Products() {
  const [products, setproducts] = useState([]);
  const location = useLocation(); // Lấy state chứa ID
  const categoryId = location.state?.categoryId; // Nhận ID từ state

  useEffect(() => {
    const fetchProducts = async () => {
      if (categoryId) {
        try {
          const data = await getProductsByCategory(categoryId); // Gọi API với ID
          setproducts(data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchProducts();
  }, [categoryId]);

  return (
    <div>
      <div className="product-list">
        {products.map((product) => (
      <ProductCard key={product.id} card={product}  />
        ))}
      </div>
    </div>
  );
}

export default Products;
