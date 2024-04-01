import axios from "axios";
import React, { useContext, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { GlobalContext, SubCategory, backendUrl } from "../App";

type ProductSubCategoryProps = {
  subcategoryid: number;
  subcategoryname: string;
  productcategoryid: number;
  subCategories: SubCategory[];
  setSubCategories: React.Dispatch<React.SetStateAction<SubCategory[] | []>>;
  deleteSubCategory:(id:number) =>  void
};

const ProductSubCategory = ({
  subcategoryid,
  subcategoryname,
  productcategoryid,
  subCategories,
  setSubCategories,
  deleteSubCategory,
}: ProductSubCategoryProps) => {
  const [isSubCategoryEdit, setIsSubCategoryEdit] = useState<boolean>(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState<string>("");
  const [subCategoryEditId, setSubCategoryEditId] = useState<number | null>(
    null
  );
  const [editSubCategoryErrorMsg,setEditCategoryErrorMsg] = useState<string>("");

  const editSubCategory = async () => {
    try {
      if(newSubCategoryName.trim().toLowerCase()===subcategoryname){
        setIsSubCategoryEdit(false);
        return;
      }  
      const response = await axios.put(
        `${backendUrl}/product/editSubCategory`,
        {
          newsubcategoryname: newSubCategoryName,
          subcategoryid: subCategoryEditId,
          productcategoryid,
        },
        { withCredentials: true }
      );
      console.log(response);
      // response.data.newSubCategory
      const newSubCategories = subCategories.map((category) => {
        if (category.subcategoryid === subCategoryEditId) {
          return response.data.newSubCategory;
        } else {
          return category;
        }
      });
      setSubCategories(newSubCategories);
      setNewSubCategoryName("");
      setSubCategoryEditId(null);
      setIsSubCategoryEdit(false);
    } catch (error:any) {
      console.log(error);
      setEditCategoryErrorMsg(error.response.data.message);
      setTimeout(()=>{
        setEditCategoryErrorMsg("");
      },3000)
    }
  };

  const editSubCategoryInit = (id: number) => {
    setIsSubCategoryEdit(true);
    setSubCategoryEditId(id);
    setNewSubCategoryName(subcategoryname);
  };

  return (
    <>
      <div className="border-b-2 border-black p-2 flex items-center gap-8">
        <div className="w-[40%] flex flex-wrap font-semibold">
          {isSubCategoryEdit ? (
            <>
            <div className="flex items-center gap-4">
                <input
                  className="border-2 rounded-lg p-2"
                  value={newSubCategoryName}
                  onChange={(e) => setNewSubCategoryName(e.target.value)}
                  type="text"
                  name="newSubCategoryName"
                  id="newSubCategoryName"
                />
              <button
                onClick={() => setIsSubCategoryEdit(false)}
                className="border-red-500 border-2 rounded-lg p-2 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300"
              >
                cancel
              </button>
              <button
                onClick={editSubCategory}
                className="border-red-500 border-2 rounded-lg p-2 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300"
              >
                submit
              </button>
            </div>
            <div className="text-red-400">
                {editSubCategoryErrorMsg}
            </div>
            </>
          ) : ( <div className="text-xl">
            {subcategoryname}
          </div>
          )}
        </div>
        {!isSubCategoryEdit && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => deleteSubCategory(subcategoryid)}
              className="text-red-500 text-2xl"
            >
              <FaTrash />
            </button>
            <button onClick={() => editSubCategoryInit(subcategoryid)} className="text-red-500 text-2xl">
              <FaEdit />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductSubCategory;
