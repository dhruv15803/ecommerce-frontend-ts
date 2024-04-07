import axios from "axios";
import React, { SetStateAction, useContext, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Cart, GlobalContext, backendUrl } from "../App";

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
  const [isShowDescription, setIsShowDescription] = useState<boolean>(false);
  const {cart,setCart}:{cart:Cart[];setCart: React.Dispatch<React.SetStateAction<Cart[]>>} = useContext(GlobalContext);
  
  const addToCart = async (productid:number) => {
try {
      const response = await axios.post(`${backendUrl}/cart/add`,{
        "productid":Number(productid),
        "itemqty":1,
      },{withCredentials:true});
      console.log(response);
      if(response.data.newCartItem.itemqty > 1){
        const newCart = cart.map((item) => {
          if(item.productid===productid){
            return response.data.newCartItem;
          } else {
            return item;
          }
        });
        setCart(newCart);
      } else {
        setCart(prevCart => [...prevCart,response.data.newCartItem]);
      }
} catch (error) {
  console.log(error);
}

  }

  return (
    <>
      <div className="border-2 gap-4 w-[40%] rounded-lg p-2 sm:w-[25%] h-96 shadow-lg flex flex-col">
        <div className="flex justify-center h-[45%]">
          <img
            src={productthumbnail}
            className="object-cover"
            alt="product-thumbnail"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex text-xl items-center font-semibold gap-2">
            <div className="flex flex-wrap items-center text-red-500">{productname}</div>
            {!isShowDescription ? (
              <button  className="text-2xl" onClick={() => setIsShowDescription(true)}>
                <IoIosArrowDown />
              </button>
            ) : (
              <button  className="text-2xl" onClick={() => setIsShowDescription(false)}>
                <IoIosArrowUp />
              </button>
            )}
          </div>
          {isShowDescription && <div className="flex flex-wrap text-md">{productdescription}</div>}
        </div>
        <div className="font-bold">Rs {productprice}</div>
        <button onClick={() => addToCart(productid)} className=" sm:w-[50%] mx-auto border-2 rounded-lg border-red-500 text-red-500 p-2 hover:bg-red-500 hover:text-white hover:duration-300">
          Add to cart
        </button>
      </div>
    </>
  );
};

export default ProductCard;
