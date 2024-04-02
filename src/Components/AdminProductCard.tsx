import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  GlobalContext,
  Product,
  SubCategory,
  backendUrl,
  productCategoryType,
} from "../App";

type AdminProductCardProps = {
  productname: string;
  productdescription: string;
  productprice: number;
  productstock: number;
  productthumbnail: string;
  productcategoryid: number;
  subcategoryid: number;
  productid: number;
  deleteProduct:(id:number) => void;
};

const AdminProductCard = ({
  productname,
  productdescription,
  productprice,
  productstock,
  productthumbnail,
  productcategoryid,
  subcategoryid,
  productid,
  deleteProduct,
}: AdminProductCardProps) => {
  const [productCategoryName, setProductCategoryName] = useState<string>("");
  const [subCategoryName, setSubCategoryName] = useState<string>("");
  const [isProductEdit, setIsProductEdit] = useState<boolean>(false);
  const [productEditId, setProductEditId] = useState<number | null>(null);
  const [newProductName, setNewProductName] = useState<string>("");
  const [newProductDescription, setNewProductDescription] =
    useState<string>("");
  const [newProductPrice, setNewProductPrice] = useState<number>(0);
  const [newProductStock, setNewProductStock] = useState<number>(0);
  const [newProductCategoryId, setNewProductCategoryId] = useState<number>(0);
  const [newSubCategoryId, setNewSubCategoryId] = useState<number>(0);
  const {
    productCategories,
    products,
    setProducts,
  }:{
    productCategories: productCategoryType[];
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[] | []>>;
  } = useContext(GlobalContext);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [newProductThumbnail, setNewProductThumbnail] = useState<File | "">("");
  const [newProductThumbnailUrl, setNewProductThumbnailUrl] =
    useState<string>("");

  const getProductCategoryById = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/product/getProductCategoryById`,
        {
          productcategoryid: productcategoryid,
        }
      );
      setProductCategoryName(response.data.categoryname);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubCategoryById = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/product/getSubCategoryById`,
        {
          subcategoryid,
          productcategoryid,
        }
      );
      setSubCategoryName(response.data.subcategoryname);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubCategories = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/product/getSubCategories`,
        {
          productcategoryid: Number(newProductCategoryId),
        }
      );
      console.log(response);
      setSubCategories(response.data.subcategories);
      setNewSubCategoryId(response.data.subcategories[0].subcategoryid);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadProductThumbnail = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/product/uploadProductThumbnail`,
        {
          productThumbnail: newProductThumbnail,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setNewProductThumbnailUrl(response.data.productThumbnailUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const editProduct = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/product/edit`,
        {
          newProductName,
          newProductDescription,
          newProductPrice: Number(newProductPrice),
          newProductStock: Number(newProductStock),
          newProductThumbnailUrl,
          newProductCategoryId: Number(newProductCategoryId),
          newSubCategoryId: Number(newSubCategoryId),
          productid: Number(productEditId),
        },
        { withCredentials: true }
      );
      console.log(response);
      const newProducts = products.map((product) => {
        if (product.productid === productEditId) {
          return response.data.updatedProduct;
        } else {
          return product;
        }
      });
      setProducts(newProducts);
      setIsProductEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const editProductCard = (id: number) => {
    setIsProductEdit(true);
    setProductEditId(id);
    setNewProductName(productname);
    setNewProductDescription(productdescription);
    setNewProductPrice(productprice);
    setNewProductStock(productstock);
    setNewProductCategoryId(productcategoryid);
    setNewSubCategoryId(subcategoryid);
    setNewProductThumbnailUrl(productthumbnail);
  };

  useEffect(() => {
    uploadProductThumbnail();
  }, [newProductThumbnail]);

  useEffect(() => {
    getProductCategoryById();
    getSubCategoryById();
  }, []);

  useEffect(() => {
    getSubCategories();
  }, [newProductCategoryId]);

  console.log(newProductThumbnailUrl);

  return (
    <>
      <div className="flex border-2 rounded-lg p-2 shadow-lg gap-4">
        <div className="flex flex-col gap-4 w-[20%]">
          {!isProductEdit && (
            <div className="flex flex-wrap justify-center">
              <img className="h-40" src={productthumbnail} alt="" />
            </div>
          )}
          {isProductEdit && (
            <div className="flex flex-wrap justify-center">
              <img className="h-40" src={newProductThumbnailUrl} alt="" />
            </div>
          )}
          {isProductEdit && (
            <div className="flex justify-center">
              <label
                className="border-2 p-2 mx-auto rounded-lg border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300"
                htmlFor="newProductThumbnail"
              >
                change thumbnail
              </label>
              <input
                onChange={(e) => setNewProductThumbnail(e.target.files![0])}
                hidden
                type="file"
                name="newProductThumbnail"
                id="newProductThumbnail"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 w-[80%] p-2">
          <div className="flex text-2xl font-bold flex-wrap">
            {isProductEdit ? (
              <>
                <input
                  className="border-2 rounded-lg p-2"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  type="text"
                  name="newProductName"
                  id="newProductName"
                />
              </>
            ) : (
              productname
            )}
          </div>
          <div className="flex flex-wrap">
            {isProductEdit ? (
              <>
                <input
                  className="border-2 rounded-lg p-2"
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  type="text"
                  name="newProductDescription"
                  id="newProductDescription"
                />
              </>
            ) : (
              productdescription
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div>
              {isProductEdit ? (
                <>
                  <select
                    className="border-2 rounded-lg p-2"
                    value={newProductCategoryId}
                    onChange={(e) =>
                      setNewProductCategoryId(Number(e.target.value))
                    }
                    name="newProductCategoryId"
                    id="newProductCategoryId"
                  >
                    {productCategories?.map((category) => {
                      return (
                        <option key={category.productcategoryid} value={category.productcategoryid}>
                          {category.categoryname}
                        </option>
                      );
                    })}
                  </select>
                </>
              ) : (
                <p>{productCategoryName} ,</p>
              )}
            </div>
            <div>
              {isProductEdit ? (
                <>
                  <select
                    className="border-2 rounded-lg p-2"
                    value={newSubCategoryId}
                    onChange={(e) =>
                      setNewSubCategoryId(Number(e.target.value))
                    }
                    name="newSubCategoryId"
                    id="newSubCategoryId"
                  >
                    {subCategories?.map((subcategory) => {
                      return (
                        <option key={subcategory.subcategoryid} value={subcategory.subcategoryid}>
                          {subcategory.subcategoryname}
                        </option>
                      );
                    })}
                  </select>
                </>
              ) : (
                subCategoryName
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              {isProductEdit ? (
                <>
                  <input
                    className="border-2 rounded-lg p-2"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    type="number"
                    name="newProductPrice"
                    id="newProductPrice"
                  />
                </>
              ) : (
                <p>Rs {productprice}</p>
              )}
            </div>
            <div>
              {isProductEdit ? (
                <>
                  <input
                    className="border-2 rounded-lg p-2"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    type="number"
                    name="newProductStock"
                    id="newProductStock"
                  />
                </>
              ) : (
                <p>stock: {productstock}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isProductEdit ? (
              <>
                <button
                  onClick={() => setIsProductEdit(false)}
                  className="border-2 rounded-lg border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300 p-2"
                >
                  Cancel
                </button>
                <button
                  onClick={editProduct}
                  className="border-2 rounded-lg border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300 p-2"
                >
                  submit
                </button>
              </>
            ) : (
              <>
                <button onClick={() => deleteProduct(productid)} className="border-2 rounded-lg border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300 p-2">
                  Delete
                </button>
                <button
                  onClick={() => editProductCard(productid)}
                  className="border-2 rounded-lg border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300 p-2"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProductCard;
