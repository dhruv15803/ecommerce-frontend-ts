import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext, backendUrl } from "../App";
import axios from "axios";
import { FaCartShopping } from "react-icons/fa6";

const Navbar = () => {
  const { isLoggedIn, loggedInUser, setIsLoggedIn, setLoggedInUser,cart} =
    useContext(GlobalContext);
  const navigate = useNavigate();

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
      <nav className="flex items-center justify-between p-4 bg-red-500 text-white">
        <div className="text-4xl">
          <Link to="/">eBazzar</Link>
        </div>
        {!isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </div>
        ) : (
          <div className="flex items-center gap-14">
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
        )}
      </nav>
    </>
  );
};

export default Navbar;
