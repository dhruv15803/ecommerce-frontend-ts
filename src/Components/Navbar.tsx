import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { GlobalContext, backendUrl, productCategoryType } from "../App";
import axios from "axios";
import { FaCartShopping } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  const { isLoggedIn, loggedInUser, setIsLoggedIn, setLoggedInUser,cart,productCategories}:{productCategories:productCategoryType[]} =
    useContext(GlobalContext);
  const navigate = useNavigate();
  const [isHamburgerOpen,setIsHamburgerOpen] = useState<boolean>(false);

  const logoutUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/user/logout`, {
        withCredentials: true,
      });
      console.log(response);
      setLoggedInUser({});
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="flex items-center p-4 bg-red-500 text-white">
        <div className="text-4xl mr-10">
          <Link to="/">eBazzar</Link>
        </div>
        <ul className="hidden lg:mx-8 lg:flex lg:items-center lg:gap-6 lg:text-xl">
          {productCategories.map((category) => {
            return <NavLink className={({isActive}) => isActive ? 'underline underline-offset-8' : ""} key={category.productcategoryid} to={`/products/${category.productcategoryid}`}><li>{category.categoryname}</li></NavLink>
          })}
        </ul>
        {!isLoggedIn ? (
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </div>
        ) : (
          <>
          <div className="hidden lg:flex lg:items-center absolute right-16 gap-4">
            <Link to='/cart'>
            <div className="flex items-center">
              <button className="text-3xl"><FaCartShopping/></button>
              <div className="border-2-red-500 rounded-full px-1 relative bottom-4 right-2 text-red-500 bg-white">
                {cart.length}
              </div>
            </div>
            </Link>
            <div className="flex items-center gap-2">
              {loggedInUser.avatarurl !== "" && (
                <img
                  className="h-12 rounded-full"
                  src={loggedInUser.avatarurl}
                  alt=""
                />
              )}
              <p>{loggedInUser.username}</p>
            </div>
            <button onClick={logoutUser} className="text-xl">
              Logout
            </button>
          </div>
          </>
        )}
      <button className="lg:hidden text-2xl absolute right-5" onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}><RxHamburgerMenu /></button>
      </nav>
      {isHamburgerOpen && <div className="flex gap-4 flex-col p-4 bg-red-500 text-white text-xl">
        {productCategories?.map((category) => {
          return <NavLink className={({isActive}) => isActive ? 'underline underline-offset-8' : ""}  to={`products/${category.productcategoryid}`} key={category.productcategoryid}><div>{category.categoryname}</div></NavLink>
        })}
        <div className="border-white  border-2"></div>
        {isLoggedIn ? <>

            <Link to='/cart'>
            <div className="flex items-center gap-4">
              <button className="text-3xl"><FaCartShopping/></button>
              <div>Cart</div>
            </div>
            </Link>
            <div className="flex items-center gap-2">
              {loggedInUser.avatarurl !== "" && (
                <img
                  className="h-12 rounded-full"
                  src={loggedInUser.avatarurl}
                  alt=""
                />
              )}
              <p>{loggedInUser.username}</p>
            </div>
            <div onClick={logoutUser} className="text-xl">
              Logout
            </div>
        </> : <>
        <div className="flex flex-col gap-4">
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </div>
        </>}
        </div>}
    </>
  );
};

export default Navbar;
