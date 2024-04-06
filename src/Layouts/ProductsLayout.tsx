import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { SubCategory, backendUrl } from "../App";

const ProductsLayout = () => {
  const { categoryid } = useParams();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categoryName,setCategoryName] = useState<string>("");
  console.log(categoryid);

  const getSubCategoriesByCategoryId = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/product/getSubCategories`,
        {
          productcategoryid: Number(categoryid),
        }
      );
      console.log(response);
      setSubCategories(response.data.subcategories);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductCategoryById = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/product/getProductCategoryById`,
        {
          productcategoryid: categoryid,
        }
      );
      setCategoryName(response.data.categoryname);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSubCategoriesByCategoryId();
    getProductCategoryById();
  }, []);

  console.log(subCategories);

  return (
    <>
      <div className="mx-12 my-10 p-2 flex items-center font-semibold text-3xl">
        {categoryName[0]?.toUpperCase() + categoryName?.slice(1)}
      </div>
      <div className="flex items-center gap-4 p-2 m-12 text-red-500 text-2xl font-semibold">
        <NavLink
          to="."
          end
          className={({ isActive }) =>
            isActive ? "underline underline-offset-4" : ""
          }
        >
          All
        </NavLink>
        {subCategories?.map((subcategory) => {
          return (
            <NavLink
              key={subcategory.subcategoryid}
              to={`${subcategory.subcategoryid}`}
              className={({isActive}) => isActive ? "underline underline-offset-4" : ""}
            >
              {subcategory.subcategoryname}
            </NavLink>
          );
        })}
      </div>
      <Outlet/>
    </>
  );
};

export default ProductsLayout;
