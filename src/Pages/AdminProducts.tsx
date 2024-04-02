import axios from "axios";
import React, { SetStateAction, useContext, useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import {
  GlobalContext,
  Product,
  SubCategory,
  backendUrl,
  productCategoryType,
} from "../App";
import AdminProductCard from "../Components/AdminProductCard";

const AdminProducts = () => {
  const [productThumbnail, setProductThumbnail] = useState<File | string>("");
  const [productThumbnailUrl, setProductThumbnailUrl] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productStock, setProductStock] = useState<number>(0);
  const {
    productCategories,
    products,
    setProducts,
  }:{
    productCategories: productCategoryType[];
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[] | []>>;
  } = useContext(GlobalContext);
  const [productCategory, setProductCategory] = useState<string>("");
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subCategory, setSubCategory] = useState<string>("");
  const [subCategoryErrorMsg, setSubCategoryErrorMsg] = useState<string>("");
  const [isAddProduct,setIsAddProduct] = useState<boolean>(false);

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

  const getSubCategoriesByCategoryName = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/product/getSubCategoriesByCategoryName`,
        {
          categoryname: productCategory,
        },
        { withCredentials: true }
      );
      console.log(response);
      setSubCategories(response.data.subcategories);
      setSubCategory(response.data.subcategories[0]?.subcategoryname);
    } catch (error: any) {
      console.log(error);
      setSubCategories(error.response?.data.subcategories);
      setSubCategoryErrorMsg(error.response?.data.message);
    }
  };

  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        `${backendUrl}/product/add`,
        {
          productName,
          productDescription,
          productPrice,
          productStock,
          productCategory,
          subCategory,
          productThumbnailUrl,
        },
        { withCredentials: true }
      );
      console.log(response);
      setProducts((prevProducts) => {
        return [...prevProducts, response.data.product];
      });
      setProductName("");
      setProductDescription("");
      setProductPrice(0);
      setProductStock(0);
      setProductCategory(productCategories[0]?.categoryname);
      setSubCategory(subCategories[0]?.subcategoryname);
      setProductThumbnailUrl("");
    } catch (error) {
      console.log(error);
    }
  };

  console.log(products);

  useEffect(() => {
    uploadProductThumbnail();
  }, [productThumbnail]);

  useEffect(() => {
    getSubCategoriesByCategoryName();
  }, [productCategory]);

  useEffect(() => {
    const setInitialCategory = () => {
      if (productCategories.length === 0) {
        setProductCategory("");
      } else {
        setProductCategory(productCategories[0]?.categoryname);
      }
    };
    setInitialCategory();
  }, [productCategories]);

  return (
    <>
      <div onClick={() => setIsAddProduct(!isAddProduct)} className=" mx-10 cursor-pointer text-red-500 hover:underline hover:underline-offset-2 my-4">
        {isAddProduct ? "Cancel" : "Add product"}
      </div>
      {isAddProduct && <div className="border-2 rounded-lg flex flex-col shadow-lg mx-10 p-4">
        <h1 className="text-red-500 font-semibold text-xl">Add products</h1>
        <form
          onSubmit={(e) => addProduct(e)}
          className="flex flex-col  my-8 gap-4"
        >
          <div className="flex flex-col justify-center gap-2">
            {productThumbnailUrl !== "" && (
              <img
                src={productThumbnailUrl}
                className="w-24 border-2 p-2 rounded-lg"
                alt=""
              />
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
            <label className="text-red-400" htmlFor="productCategory">
              Select product category
            </label>
            <select
              className="border-2 rounded-lg p-2"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              name="productCategory"
              id="productCategory"
            >
              {productCategories?.map((category) => {
                return (
                  <option
                    key={category.productcategoryid}
                    value={category.categoryname}
                  >
                    {category.categoryname}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <label className="text-red-400" htmlFor="subCategory">
              Select subcategory
            </label>
            {subCategories?.length === 0 && (
              <div className="text-xl text-red-500 font-semibold">
                {subCategoryErrorMsg}
              </div>
            )}
            {subCategories?.length !== 0 && (
              <select
                className="border-2 rounded-lg p-2"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                name="subCategory"
                id="subCategory"
              >
                {subCategories?.map((subcategory) => {
                  return (
                    <option
                      key={subcategory.subcategoryid}
                      value={subcategory.subcategoryname}
                    >
                      {subcategory.subcategoryname}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
          <button className="flex justify-center items-center gap-2 border-2 rounded-lg p-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300 w-[25%] m-auto mt-8">
            Add product
          </button>
        </form>
      </div>}
      <div className="flex flex-col gap-4 mx-10 my-2 border-2 p-4">
        {products?.map((product) => {
          return <AdminProductCard 
          key={product.productid}
          productname={product.productname}
          productdescription={product.productdescription}
          productprice={product.productprice}
          productstock={product.productstock}
          productthumbnail={product.productthumbnail}
          productcategoryid={product.productcategoryid}
          subcategoryid={product.subcategoryid}
          productid={product.productid}
          />
        })}
      </div>
    </>
  );
};

export default AdminProducts;
