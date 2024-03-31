import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { GlobalContext, backendUrl, productCategoryType } from "../App";

const AdminProducts = () => {
  const [productThumbnail, setProductThumbnail] = useState<File | string>("");
  const [productThumbnailUrl, setProductThumbnailUrl] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productStock, setProductStock] = useState<number>(0);
  const [productCategory,setProductCategory] = useState<string>("");
  const {productCategories}:{productCategories:productCategoryType[]}  = useContext(GlobalContext);

  const uploadProductThumbnail = async () => {
    try {
      if (productThumbnail === "") {
        return;
      }
      const response = await axios.post(
        `${backendUrl}/product/uploadProductThumbnail`,
        {
          productThumbnail,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setProductThumbnailUrl(response.data.productThumbnailUrl);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    uploadProductThumbnail();
  }, [productThumbnail]);

  return (
    <>
      <div className="border-2 rounded-lg flex flex-col shadow-lg mx-10 p-4">
        <h1 className="text-red-500 font-semibold text-xl">Add products</h1>
        <form className="flex flex-col  my-8 gap-4">
          <div className="flex flex-col justify-center gap-2">
            {productThumbnailUrl !== "" && (
              <img src={productThumbnailUrl} className="w-24 border-2 p-2 rounded-lg" alt="" />
            )}
            <label
              className="flex justify-center items-center gap-2 border-2 rounded-lg p-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300 w-[15%]"
              htmlFor="productThumbnail"
            >
              <FaImage />
              Add image
            </label>
            <input
              hidden
              type="file"
              onChange={(e) => setProductThumbnail(e.target.files![0])}
              name="productThumbnail"
              id="productThumbnail"
            />
          </div>
          <div className="flex flex-col justify-center gap-2">
            <label className="text-red-400" htmlFor="productName">
              Enter product name
            </label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="border-2 rounded-lg p-2"
              type="text"
              name="productName"
              id="productName"
              placeholder="eg: black cotton t-shirt"
            />
          </div>
          <div className="flex flex-col justify-center gap-2">
            <label className="text-red-400" htmlFor="productDescription">
              Enter product description
            </label>
            <input
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="border-2 rounded-lg p-2"
              type="text"
              name="productDescription"
              id="productDescription"
              placeholder="eg: 100% cotton black v-neck t-shirt"
            />
          </div>
          <div className="flex flex-col justify-center gap-2">
            <label className="text-red-400" htmlFor="productPrice">
              Enter product price
            </label>
            <input
              value={productPrice}
              onChange={(e) => setProductPrice(Number(e.target.value))}
              className="border-2 rounded-lg p-2"
              type="number"
              name="productPrice"
              id="productPrice"
              placeholder="eg: 900 Rs"
            />
          </div>
          <div className="flex flex-col justify-center gap-2">
            <label className="text-red-400" htmlFor="productStock">
              Enter product stock
            </label>
            <input
              value={productStock}
              onChange={(e) => setProductStock(Number(e.target.value))}
              className="border-2 rounded-lg p-2"
              type="number"
              name="productStock"
              id="productStock"
              placeholder="eg: 20"
            />
          </div>
          <div className="flex flex-col justify-center gap-2">
            <label className="text-red-400" htmlFor="productCategory">Select product category</label>
            <select className="border-2 rounded-lg p-2" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} name="productCategory" id="productCategory">
                {productCategories?.map((category) => {
                    return <option key={category.productcategoryid} value={category.categoryname}>{category.categoryname}</option>
                })}
            </select>
          </div>
          <button className="flex justify-center items-center gap-2 border-2 rounded-lg p-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300 w-[25%] m-auto mt-8">
            Add product
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminProducts;
