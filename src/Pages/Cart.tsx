import React, { SetStateAction, useContext, useEffect, useState } from "react";
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
  const [cartTotal,setCartTotal] = useState<number>(0);

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


  const getTotalPrice = () => {
    let total = 0;
    for(let i=0;i<cart.length;i++){
        total+=cart[i].productprice * cart[i].itemqty;
    }
    setCartTotal(total);
  }

  useEffect(()=>{
    getTotalPrice();
  },[cart])

  return (
    <>
    <div className="flex m-10 items-center text-3xl font-semibold">Cart</div>

    <div className="flex flex-col lg:flex-row gap-4 m-10">
      <div className="flex lg:w-[80%] flex-col justify-center gap-4 mx-10">
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
      <div className="mx-10 flex lg:w-[20%] lg:mx-0 flex-col border-2 rounded-lg shadow-lg p-4">
        <div className="flex font-semibold text-3xl items-center">Order summary</div>
        {cart.map((item) => {
            return <div className="flex items-center my-1 justify-between" key={item.cartid}>
                <span>{item.productname} ({item.itemqty}x)</span>
                <span>Rs {item.productprice * item.itemqty}</span>
            </div>
        })}
        <div className="flex items-center mt-8 gap-2">
            <div className="text-xl">Sub total:</div>
            <div className="text-xl">Rs {cartTotal}</div>
        </div>
        <div className="flex items-center my-2 border-b-2 border-black gap-2">
            <div className="text-xl">Taxes: Rs 0</div>
        </div>
        <div className="flex items-center gap-2">
            <div className="text-xl">Total:</div>
            <div className="text-xl">Rs {cartTotal}</div>
        </div>
        <button className="my-4 p-2 border-2 rounded-lg border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300">Checkout</button>
      </div>
    </div>
    </>
  );
};

export default Cart;
