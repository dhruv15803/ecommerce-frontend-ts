import axios from "axios";
import React, { useContext, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { GlobalContext, backendUrl, productCategoryType } from "../App";

type ProductCategoryCardProps = {
  categoryname: string;
  productcategoryid: number;
  deleteProductCategory: (productcategoryid: number) => void;
};

const ProductCategoryCard = ({
  categoryname,
  productcategoryid,
  deleteProductCategory,
}: ProductCategoryCardProps) => {
  const [isCategoryEdit, setIsCategoryEdit] = useState<boolean>(false);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [newProductCategory, setNewProductCategory] = useState<string>("");
  const [editCategoryErrorMsg,setEditCategoryErrorMsg] = useState<string>("");
  const {
    productCategories,
    setProductCategories,
  }: {
    productCategories: productCategoryType[];
    setProductCategories: React.Dispatch<
      React.SetStateAction<productCategoryType[] | []>
    >;
  } = useContext(GlobalContext);

  const editProductCategory = (id: number) => {
    setEditCategoryId(id);
    setIsCategoryEdit(true);
    setNewProductCategory(categoryname);
  };

  const editProductCategoryCard = async (id: number) => {
    try {
      if(newProductCategory.trim().toLowerCase()===categoryname){
        setEditCategoryId(null);
        setIsCategoryEdit(false);
        setNewProductCategory("");
        return;
      }
      const response = await axios.put(
        `${backendUrl}/product/editProductCategory`,
        {
          newProductCategory,
          id,
        },
        { withCredentials: true }
      );
      console.log(response);
      const newProductCategories = productCategories.map(
        (category: { productcategoryid: number; categoryname: string }) => {
          if (category.productcategoryid === editCategoryId) {
            return response.data.newCategory;
          } else {
            return category;
          }
        }
      );
      setProductCategories(newProductCategories);
      setIsCategoryEdit(false);
      setNewProductCategory("");
      setEditCategoryId(null);
    } catch (error:any) {
      console.log(error);
      setEditCategoryErrorMsg(error.response.data.message);
      setTimeout(()=>{
        setEditCategoryErrorMsg("");
      },3000)
    }
  };

  return (
    <>
      <div className="flex items-center border-b-2 border-black gap-4 p-2">
        <div className="text-xl font-semibold w-[40%]">
          {isCategoryEdit ? (
            <input
              className="border-2 rounded-lg p-2"
              value={newProductCategory}
              onChange={(e) => setNewProductCategory(e.target.value)}
              type="text"
              name="newProductCategory"
            />
          ) : (
            categoryname
          )}
        </div>
        {isCategoryEdit ? (
          <>
            <div className="flex items-center gap-4">
              <button
                className="p-2 border-2 rounded-lg border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300"
                onClick={() => setIsCategoryEdit(false)}
              >
                Cancel
              </button>
              <button
                className="p-2 border-2 rounded-lg border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300"
                onClick={() => editProductCategoryCard(editCategoryId!)}
              >
                submit
              </button>
            </div>
            <div>{editCategoryErrorMsg}</div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <button
              className="text-red-500 text-2xl"
              onClick={() => deleteProductCategory(productcategoryid)}
            >
              <FaTrash />
            </button>
            <button
              onClick={() => editProductCategory(productcategoryid)}
              className="text-red-500 text-2xl"
            >
              <FaEdit />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductCategoryCard;
