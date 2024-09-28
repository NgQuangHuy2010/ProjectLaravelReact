import React from "react";
import Category from "~/components/Goods/Category";
import Products from "~/components/Goods/Products";
function Goods() {
  return (
    <div>


      <div className="row">
          <Category />        
          <Products />
      </div>
    </div>
  );
}

export default Goods;
