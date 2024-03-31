import axios from "axios";
import React, { useContext, useState } from "react";
import { GlobalContext, backendUrl } from "../App";
import { productCategoryType } from "../App";
import ProductCategoryCard from "../Components/ProductCategoryCard";

const AdminCategories = () => {
  const [productCategory, setProductCategory] = useState<string>("");
  const {
    productCategories,
    setProductCategories,
  }: {
    productCategories: productCategoryType[];
    setProductCategories: React.Dispatch<
      React.SetStateAction<productCategoryType[] | []>
    >;
  } = useContext(GlobalContext);
  const [addCategoryErrorMsg, setAddCategoryErrorMsg] = useState<string>("");

  const addProductCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        `${backendUrl}/product/addCategory`,
        {
          productCategory,
        },
        { withCredentials: true }
      );
      console.log(response);
      setProductCategories((prevCategories: productCategoryType[]) => {
        return [...prevCategories, response.data.productCategory];
      });
      setProductCategory("");
    } catch (error: any) {
      console.log(error);
      setAddCategoryErrorMsg(error.response.data.message);
      setTimeout(() => {
        setAddCategoryErrorMsg("");
      }, 3000);
    }
  };

  const deleteProductCategory = async (id: number) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/product/deleteProductCategory/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const newProductCategories = productCategories.filter(
        (category: productCategoryType) => category.productcategoryid !== id
      );
      setProductCategories(newProductCategories);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(productCategories);

  return (
    <>
      <div className="border-2 flex flex-col rounded-lg m-10 shadow-lg p-4">
        <form
          onSubmit={(e) => addProductCategory(e)}
          className="flex items-center gap-4"
        >
          <input
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            className="border-2 rounded-lg p-2"
            type="text"
            name="productCategory"
            id=""
            placeholder='eg: men"s clothing'
          />
          <button className="border-2 rounded-lg p-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300">
            Add category
          </button>
        </form>
        <div className="text-red-400 my-2">{addCategoryErrorMsg}</div>
        <div className="text-red-500 font-semibold text-xl my-8">
          Categories
        </div>
        <div className="flex flex-col gap-4 m-4">
          {productCategories?.map(
            (category: { productcategoryid: number; categoryname: string }) => {
              return (
                <ProductCategoryCard
                  key={category.productcategoryid}
                  categoryname={category.categoryname}
                  productcategoryid={category.productcategoryid}
                  deleteProductCategory={deleteProductCategory}
                />
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

export default AdminCategories;
