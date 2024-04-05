import React from "react";

type ProductProps = {
  productid: number;
  productname: string;
  productdescription: string;
  productprice: number;
  productstock: number;
  productcategoryid: number;
  subcategoryid: number;
  productthumbnail: string;
};

const ProductCard = ({
  productid,
  productname,
  productdescription,
  productprice,
  productstock,
  productcategoryid,
  subcategoryid,
  productthumbnail,
}: ProductProps) => {
  return (
    <>
      <div className="border-2 gap-4 rounded-lg p-2 w-[25%] h-96 shadow-lg flex flex-col">
        <div className="flex justify-center h-[45%]">
          <img
            src={productthumbnail}
            className="object-cover"
            alt="product-thumbnail"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap text-xl font-semibold text-red-500">
            {productname}
          </div>
          <div className="flex flex-wrap text-md">{productdescription}</div>
        </div>
        <div className="font-bold">Rs {productprice}</div>
        <button className="w-[50%] mx-auto border-2 rounded-lg border-red-500 text-red-500 p-2 hover:bg-red-500 hover:text-white hover:duration-300">
          Add to cart
        </button>
      </div>
    </>
  );
};

export default ProductCard;
