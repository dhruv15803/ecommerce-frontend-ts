import React, { useEffect, useState } from "react";
import { Cart, backendUrl } from "../App";
import axios from "axios";


interface CartCardProps extends Cart {
    deleteCartItem:(cartid:number) => void;
    incrementQty:(cartid:number) => void;
    decrementQty:(cartid:number) => void;
}

const CartCard = ({
  cartid,
  itemqty,
  productcategoryid,
  productdescription,
  productid,
  productname,
  productprice,
  productstock,
  productthumbnail,
  subcategoryid,
  userid,
  deleteCartItem,
  incrementQty,
  decrementQty,
}: CartCardProps) => {
  const [productCategoryName, setProductCategoryName] = useState<string>("");
  const [subCategoryName, setSubCategoryName] = useState<string>("");

  const getProductCategoryById = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/product/getProductCategoryById`,
        {
          productcategoryid: productcategoryid,
        }
      );
      setProductCategoryName(response.data.categoryname);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubCategoryById = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/product/getSubCategoryById`,
        {
          subcategoryid,
          productcategoryid,
        }
      );
      setSubCategoryName(response.data.subcategoryname);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductCategoryById();
    getSubCategoryById();
  }, []);

  return (
    <>
      <div className="border-2 rounded-lg p-2 shadow-lg flex  gap-4">
        <div className="w-[20%] border-2 flex justify-center rounded-lg">
          <img className="object-contain" src={productthumbnail} alt="" />
        </div>
        <div className="flex flex-col border-2 p-2 w-full gap-2">
          <div className="flex flex-col">
            <div className="text-2xl font-semibold">{productname}</div>
            <div className="text-lg">{productdescription}</div>
          </div>
          <div className="flex items-center gap-2">
            <div>{productCategoryName}</div>
            <div>{subCategoryName}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => decrementQty(cartid)} className=" p-1 border-2 rounded-xl border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300">
              -
            </button>
            <p>{itemqty}</p>
            <button onClick={() => incrementQty(cartid)} className=" p-1 border-2 rounded-xl border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300">
              +
            </button>
          </div>
          {productstock < 10 && <div className="flex items-center text-red-500">
            {productstock} left in stock!
          </div>}
          <div className="flex items-center font-bold">
            <p>Rs {productprice}</p>
          </div>
          <div className="flex items-center my-4">
            <button onClick={() => deleteCartItem(cartid)} className="border-2 p-2 rounded-xl border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300" >Delete</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartCard;
