import React, { SetStateAction, useContext } from "react";
import { Cart as CartType, GlobalContext, backendUrl } from "../App";
import CartCard from "../Components/CartCard";
import axios from "axios";

const Cart = () => {
  const {
    cart,
    setCart,
  }: { cart: CartType[]; setCart: React.Dispatch<SetStateAction<CartType[]>> } =
    useContext(GlobalContext);
  console.log(cart);

  const deleteCartItem = async (cartid: number) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/cart/delete/${cartid}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const newCart = cart.filter((item) => item.cartid !== cartid);
      setCart(newCart);
    } catch (error) {
      console.log(error);
    }
  };

  const incrementQty = async (cartid: number) => {
    try {
      const cartItem = cart.find((item) => item.cartid === cartid);
      const itemqty = cartItem?.itemqty;
      if(itemqty === cartItem?.productstock){
        return;
      }
      const response = await axios.put(
        `${backendUrl}/cart/incrementQty`,
        {
          itemqty,
          cartid,
        },
        { withCredentials: true }
      );
      console.log(response);
      const newCart = cart.map((item) => {
        if (item.cartid === cartid) {
          return {
            ...item,
            itemqty: itemqty! + 1,
          };
        } else {
          return item;
        }
      });
      setCart(newCart);
    } catch (error) {
      console.log(error);
    }
  };

  const decrementQty = async (cartid: number) => {
    try{
    const cartItem = cart.find((item) => item.cartid === cartid);
    const itemqty = cartItem?.itemqty;
    if(itemqty === 1){
      return;
    }
    const response = await axios.put(
      `${backendUrl}/cart/decrementQty`,
      {
        itemqty,
        cartid,
      },
      { withCredentials: true }
    );
    console.log(response);
    const newCart = cart.map((item) => {
      if (item.cartid === cartid) {
        return {
          ...item,
          itemqty: itemqty! - 1,
        };
      } else {
        return item;
      }
    });
    setCart(newCart);
  } catch (error) {
    console.log(error);
  }
  };
  
  return (
    <>
      <div className="m-10 flex items-center text-3xl font-semibold">Cart</div>
      <div className="flex flex-col justify-center gap-4 mx-10">
        {cart?.map((item) => {
          return (
            <CartCard
              key={item.cartid}
              cartid={item.cartid}
              productid={item.productid}
              productname={item.productname}
              productdescription={item.productdescription}
              productprice={item.productprice}
              productstock={item.productstock}
              productthumbnail={item.productthumbnail}
              productcategoryid={item.productcategoryid}
              subcategoryid={item.subcategoryid}
              userid={item.userid}
              itemqty={item.itemqty}
              deleteCartItem={deleteCartItem}
              incrementQty={incrementQty}
              decrementQty={decrementQty}
            />
          );
        })}
      </div>
    </>
  );
};

export default Cart;
