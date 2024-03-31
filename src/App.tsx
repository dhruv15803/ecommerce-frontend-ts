import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layouts/Layout";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Admin from "./Pages/Admin";
import AdminLayout from "./Layouts/AdminLayout";
import AdminProducts from "./Pages/AdminProducts";
import AdminCategories from "./Pages/AdminCategories";
import AdminSubCategories from "./Pages/AdminSubCategories";

export const backendUrl = "http://localhost:5000";

export const GlobalContext = createContext(null);

export interface User {
  userid: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  address_field_1?: null | string;
  address_field_2?: null | string;
  addess_field_3?: null | string;
  isadmin: boolean;
  avatarurl: string;
  password: string;
}

export interface Product {
  productid: number;
  productname: string;
  productprice: number;
  productstock: number;
  productcategoryid: number;
  subcategoryid: number;
  productthumbnail: string;
}

export interface productCategoryType {
  productcategoryid: number;
  categoryname: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<User | {}>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[] | []>([]);
  const [productCategories, setProductCategories] = useState<
    productCategoryType[] | []
  >([]);

  const getLoggedInUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/user/getLoggedInUser`, {
        withCredentials: true,
      });
      setLoggedInUser(response.data.user);
      setIsLoggedIn(true);
      setIsAdmin(response.data.user.isadmin);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProductCategories = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/product/getAllProductCategories`
      );
      setProductCategories(response.data.productCategories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProductCategories();
    getLoggedInUser();
  }, []);

  return (
    <>
      <GlobalContext.Provider
        value={{
          isLoggedIn,
          setIsLoggedIn,
          loggedInUser,
          setLoggedInUser,
          isAdmin,
          setIsAdmin,
          products,
          setProducts,
          productCategories,
          setProductCategories,
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="subcategories" element={<AdminSubCategories />} />
                <Route />
              </Route>
            </Route>
          </Routes>
        </Router>
      </GlobalContext.Provider>
    </>
  );
}

export default App;
