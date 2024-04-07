import React, { SetStateAction, useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext, Product } from "../App";
import ProductCard from "../Components/ProductCard";

const Products = () => {
  const params = useParams();
  const {
    products,
    setProducts,
  }: {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[] | []>>;
  } = useContext(GlobalContext);

  console.log(products);

  return (
    <>
      <div className="flex flex-row flex-wrap my-10 items-center gap-4 p-4 justify-center">
        {products?.filter(
            (product) => String(product.productcategoryid) === params.categoryid
          )?.filter((product) => {
            if(params.subcategoryid===undefined){
                return product;
            } else {
                return String(product.subcategoryid)===params.subcategoryid;
            }
          })?.map((product) => {
            return <ProductCard 
                    key={product.productid}
                    productid={product.productid}
                    productname={product.productname}
                    productdescription={product.productdescription}
                    productprice={product.productprice}
                    productstock={product.productstock}
                    productcategoryid={product.productcategoryid}
                    subcategoryid={product.subcategoryid}
                    productthumbnail={product.productthumbnail}
             />;
          })}
      </div>
    </>
  );
};

export default Products;
