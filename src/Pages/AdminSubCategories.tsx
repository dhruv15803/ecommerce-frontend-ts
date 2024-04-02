import React, { useContext, useEffect, useState } from "react";
import {
  GlobalContext,
  SubCategory,
  backendUrl,
  productCategoryType,
} from "../App";
import axios from "axios";
import ProductSubCategory from "../Components/ProductSubCategory";

const AdminSubCategories = () => {
  const {
    productCategories,
    setProductCategories,
  }: {
    productCategories: productCategoryType[];
    setProductCategories: React.Dispatch<
      React.SetStateAction<productCategoryType[] | []>
    >;
  } = useContext(GlobalContext);
  const [productCategory, setProductCategory] = useState<number | "">("");
  const [subCategories, setSubCategories] = useState<SubCategory[] | []>([]);
  const [isAddSubCategory, setIsAddSubCategory] = useState<boolean>(false);
  const [subCategoryName, setSubCategoryName] = useState<string>("");

  const getSubCategories = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/product/getSubCategories`,
        {
          productcategoryid: productCategory,
        },
        { withCredentials: true }
      );
      console.log(response);
      setSubCategories(response.data.subcategories);
    } catch (error) {
      console.log(error);
    }
  };

  const addSubCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        `${backendUrl}/product/addSubCategory`,
        {
          subcategoryname: subCategoryName,
          productcategoryid: productCategory,
        },
        { withCredentials: true }
      );
      console.log(response);
      setSubCategories((prevCategories) => {
        return [...prevCategories, response.data.newSubCategory];
      });
      setSubCategoryName("");
    } catch (error) {
      console.log(error);
    }
  };

  // id -> subcategoryid
  const deleteSubCategory = async (id: number) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/product/deleteSubCategory/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const newSubCategories = subCategories.filter(
        (subcategory) => subcategory.subcategoryid !== id
      );
      setSubCategories(newSubCategories);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(subCategories);

  useEffect(() => {
    getSubCategories();
  }, [productCategory]);

  useEffect(() => {
    const setInitialCategory = () => {
      if (productCategories.length === 0) {
        setProductCategory("");
      } else {
        setProductCategory(Number(productCategories[0]?.productcategoryid));
      }
    };
    setInitialCategory();
  }, [productCategories]);
  return (
    <>
      <div className="border-2 rounded-lg p-2 shadow-lg m-10 flex flex-col">
        <label
          className="text-red-500 font-semibold text-xl"
          htmlFor="productCategory"
        >
          Select parent category
        </label>
        <select
          value={productCategory}
          onChange={(e) => setProductCategory(Number(e.target.value))}
          className="border-2 rounded-lg p-2 my-4"
          name="productCategory"
          id="productCategory"
        >
          {productCategories?.map((category: productCategoryType) => {
            return (
              <option
                key={category.productcategoryid}
                value={category.productcategoryid}
              >
                {category.categoryname}
              </option>
            );
          })}
        </select>
        <div className="text-red-500 font-semibold text-3xl">
          sub categories
        </div>
        <div className="flex flex-col mx-10 my-6 p-2 gap-4">
          {subCategories?.map((category: SubCategory) => {
            return (
              <ProductSubCategory
                key={category.subcategoryid}
                subcategoryid={category.subcategoryid}
                subcategoryname={category.subcategoryname}
                productcategoryid={category.productcategoryid}
                subCategories={subCategories}
                setSubCategories={setSubCategories}
                deleteSubCategory={deleteSubCategory}
              />
            );
          })}
          <div
            onClick={() => setIsAddSubCategory(!isAddSubCategory)}
            className="cursor-pointer text-red-500 hover:underline hover:underline-offset-4"
          >
            {isAddSubCategory ? "cancel" : "Add subcategory"}
          </div>
          {isAddSubCategory && (
            <>
              <form
                onSubmit={(e) => addSubCategory(e)}
                className="flex items-center gap-2"
              >
                <input
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  className="border-2 rounded-lg p-2"
                  type="text"
                  name="subCategory"
                  id="subCategory"
                  placeholder="eg:men's footwear"
                />
                <button className="text-red-500 border-2 border-red-500 rounded-lg p-2 hover:bg-red-500 hover:text-white hover:duration-300">
                  Add sub category
                </button>
              </form>
            </>
          )}
        </div>
        {}
      </div>
    </>
  );
};

export default AdminSubCategories;
