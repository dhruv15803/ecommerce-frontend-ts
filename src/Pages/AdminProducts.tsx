import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import {
  GlobalContext,
  Product,
  SubCategory,
  backendUrl,
  productCategoryType,
} from "../App";
import AdminProductCard from "../Components/AdminProductCard";
import Loader from "../Components/Loader";
import * as Papa from "papaparse";

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
  }: {
    productCategories: productCategoryType[];
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[] | []>>;
  } = useContext(GlobalContext);
  const [productCategory, setProductCategory] = useState<string>("");
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subCategory, setSubCategory] = useState<string>("");
  const [subCategoryErrorMsg, setSubCategoryErrorMsg] = useState<string>("");
  const [isAddProduct, setIsAddProduct] = useState<boolean>(false);
  const [filterCategoryId, setFilterCategoryId] = useState<number | string>(
    "none"
  );
  const [sortByProductAmount, setSortByProductAmount] = useState<number>(0);
  const [isAvatarLoading, setIsAvatarLoading] = useState<boolean>(false);
  const [filterSubCategoryId, setFilterSubCategoryId] = useState<
    number | string
  >("none");
  const [filterSubCategories, setFilterSubCategories] = useState<SubCategory[]>(
    []
  );
  const [csvFile, setCsvFile] = useState<File | string>("");
  const [csvData, setCsvData] = useState<any>([]);

  const uploadProductThumbnail = async () => {
    try {
      if (productThumbnail === "") {
        return;
      }
      setIsAvatarLoading(true);
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
      setIsAvatarLoading(false);
      setProductThumbnailUrl(response.data.productThumbnailUrl);
    } catch (error) {
      console.log(error);
      setIsAvatarLoading(false);
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

  const getSubCategoriesByCategoryId = async () => {
    try {
      if (filterCategoryId === "none") {
        return;
      }
      const response = await axios.post(
        `${backendUrl}/product/getSubCategories`,
        {
          productcategoryid: Number(filterCategoryId),
        }
      );
      console.log(response);
      setFilterSubCategories(response.data.subcategories);
      setFilterSubCategoryId("none");
    } catch (error) {
      console.log(error);
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

  const addCsvProducts = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/product/addCsv`,
        {
          csvData: csvData,
        },
        { withCredentials: true }
      );
      console.log(response);
      setProducts((prevProducts) => [
        ...prevProducts,
        ...response.data.newProducts,
      ]);
      setCsvFile("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/product/deleteProduct/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const newProducts = products.filter(
        (product) => product.productid !== id
      );
      setProducts(newProducts);
    } catch (error) {
      console.log(error);
    }
  };

  const sortProductsByAmount = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/product/sortByAmount`,
        {
          sortByProductAmount,
        },
        { withCredentials: true }
      );
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const parseCsvFile = () => {
    Papa.parse(csvFile, {
      complete: (result: any) => {
        setCsvData(result.data);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  console.log(products);

  useEffect(() => {
    sortProductsByAmount();
  }, [sortByProductAmount]);

  useEffect(() => {
    uploadProductThumbnail();
  }, [productThumbnail]);

  useEffect(() => {
    getSubCategoriesByCategoryName();
  }, [productCategory]);

  useEffect(() => {
    getSubCategoriesByCategoryId();
  }, [filterCategoryId]);

  useEffect(() => {
    parseCsvFile();
  }, [csvFile]);

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
      <div className="flex items-center mx-10 gap-4 text-red-500">
        <div
          onClick={() => setIsAddProduct(!isAddProduct)}
          className="w-fit cursor-pointer text-red-500 hover:underline hover:underline-offset-2 my-4"
        >
          {isAddProduct ? "Cancel" : "Add product"}
        </div>
        {csvFile === "" ? (
          <div className="cursor-pointer hover:underline hover:underline-offset-2">
            <label htmlFor="csvFile">upload csv file</label>
            <input
              hidden
              onChange={(e) => setCsvFile(e.target.files![0])}
              type="file"
              name="csvFile"
              id="csvFile"
            />
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <button
                className="hover:underline hover:underline-offset-4"
                onClick={() => setCsvFile("")}
              >
                remove file
              </button>
              <button
                className="hover:underline hover:underline-offset-4"
                onClick={addCsvProducts}
              >
                submit file
              </button>
            </div>
          </>
        )}
      </div>
      {isAddProduct && (
        <div className="border-2 rounded-lg flex flex-col shadow-lg mx-10 p-4">
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
              {isAvatarLoading ? (
                <>
                  <Loader height="80" width="80" />
                </>
              ) : (
                <>
                  <label
                    className="w-[25%] flex justify-center items-center gap-2 border-2 rounded-lg p-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300 lg:w-[15%]"
                    htmlFor="productThumbnail"
                  >
                    <button className="text-2xl">
                      <FaImage />
                    </button>
                    Add image
                  </label>
                  <input
                    hidden
                    type="file"
                    onChange={(e) => setProductThumbnail(e.target.files![0])}
                    name="productThumbnail"
                    id="productThumbnail"
                  />
                </>
              )}
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
        </div>
      )}
      {products.length !== 0 && (
        <div className="border-2 rounded-lg p-2 mx-10 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <label htmlFor="filterCategoryId">Filter by category</label>
            <select
              value={filterCategoryId}
              onChange={(e) => {
                setFilterCategoryId(e.target.value);
                setFilterSubCategoryId("none");
              }}
              className="border-2 rounded-lg p-2"
              name="filterCategoryId"
              id="filterCategoryId"
            >
              <option value="none">none</option>
              {productCategories?.map((category) => {
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
          </div>
          <div className="flex items-center gap-2">
            <p>Sort by amount</p>
            <select
              className="border-2 rounded-lg p-2"
              value={sortByProductAmount}
              onChange={(e) => setSortByProductAmount(Number(e.target.value))}
              name="sortByProductAmount"
              id="sortByProductAmount"
            >
              <option value={0}>none</option>
              <option value={1}>low to high</option>
              <option value={-1}>high to low</option>
            </select>
          </div>

          {filterCategoryId !== "none" && (
            <>
              <div className="flex items-center gap-2">
                <p>filter by subcategory</p>
                <select
                  className="border-2 rounded-lg p-2"
                  value={filterSubCategoryId}
                  onChange={(e) => setFilterSubCategoryId(e.target.value)}
                  name="filterSubCategoryId"
                  id="filterSubCategoryId"
                >
                  <option value="none">none</option>
                  {filterSubCategories?.map((subcategory) => {
                    return (
                      <option
                        key={subcategory.subcategoryid}
                        value={subcategory.subcategoryid}
                      >
                        {subcategory.subcategoryname}
                      </option>
                    );
                  })}
                </select>
              </div>
            </>
          )}
        </div>
      )}
      <div className="flex flex-col gap-4 mx-10 my-2  p-4">
        {products
          ?.filter((product) => {
            if (filterCategoryId === "none") {
              return product;
            } else {
              return product.productcategoryid === filterCategoryId;
            }
          })
          ?.filter((product) => {
            if (filterSubCategoryId === "none") {
              return product;
            } else {
              return product.subcategoryid === filterSubCategoryId;
            }
          })
          ?.map((product) => {
            return (
              <AdminProductCard
                key={product.productid}
                productname={product.productname}
                productdescription={product.productdescription}
                productprice={product.productprice}
                productstock={product.productstock}
                productthumbnail={product.productthumbnail}
                productcategoryid={product.productcategoryid}
                subcategoryid={product.subcategoryid}
                productid={product.productid}
                deleteProduct={deleteProduct}
              />
            );
          })}
        {products?.filter((product) => {
          if (filterCategoryId === "none") {
            return product;
          } else {
            return product.productcategoryid === filterCategoryId;
          }
        })?.length === 0 && (
          <div className="flex justify-center my-20">
            <div className="text-2xl text-red-500">
              No products in this category
            </div>
          </div>
        )}
        {products?.filter((product) => {
          if (filterCategoryId === "none") {
            return product;
          } else {
            return product.productcategoryid === filterCategoryId;
          }
        }).length !== 0 &&
          products
            ?.filter((product) => {
              if (filterCategoryId === "none") {
                return product;
              } else {
                return product.productcategoryid === filterCategoryId;
              }
            })
            ?.filter((product) => {
              if (filterSubCategoryId === "none") {
                return product;
              } else {
                return product.subcategoryid === filterSubCategoryId;
              }
            })?.length === 0 && (
            <div className="flex justify-center my-20">
              <div className="text-2xl text-red-500">
                No products in this subcategory
              </div>
            </div>
          )}
        {products.length === 0 && (
          <div className="my-20">
            <div className="text-2xl text-red-500 flex justify-center">
              No products added
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProducts;
