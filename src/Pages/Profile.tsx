import React, { useContext, useEffect, useState } from "react";
import { GlobalContext, User, backendUrl } from "../App";
import bcrypt from "bcryptjs-react";
import axios from "axios";
import Loader from "../Components/Loader";

const Profile = () => {
  const {
    loggedInUser,
    setLoggedInUser,
  }: {
    loggedInUser: User;
    setLoggedInUser: React.Dispatch<React.SetStateAction<{} | User>>;
  } = useContext(GlobalContext);
  const [isEditPassword, setIsEditPassword] = useState<boolean>(false);
  const [isEditUsername, setIsEditUsername] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(false);
  const [newAvatar, setNewAvatar] = useState<File | string>("");
  const [isAvatarLoading, setIsAvatarLoading] = useState<boolean>(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>("");
  const [isAvatarEdit, setIsAvatarEdit] = useState<boolean>(false);
  const [addressField1, setAddressField1] = useState<string>("");
  const [addressField2, setAddressField2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [pincode, setPincode] = useState<number | string>("");
  const [isEditUserAddress,setIsEditUserAddress] = useState<boolean>(false);

  const checkPassword = async () => {
    try {
      const isCorrect = await bcrypt.compare(
        currentPassword,
        loggedInUser.password
      );
      setIsPasswordCorrect(isCorrect);
    } catch (error) {
      console.log(error);
    }
  };

  const editUsername = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newUsername.trim().toLowerCase() === loggedInUser.username) {
      setIsEditUsername(false);
      return;
    }
    try {
      const response = await axios.put(
        `${backendUrl}/user/editUsername`,
        {
          newUsername,
        },
        { withCredentials: true }
      );
      console.log(response);
      setLoggedInUser(response.data.newUser);
      setIsEditUsername(false);
    } catch (error) {
      console.log(error);
    }
  };

  const editPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${backendUrl}/user/editPassword`,
        {
          newPassword,
        },
        { withCredentials: true }
      );
      console.log(response);
      setLoggedInUser(response.data.newUser);
      setIsEditPassword(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  const uploadNewAvatar = async () => {
    try {
      setIsAvatarLoading(true);
      const response = await axios.post(
        `${backendUrl}/user/uploadAvatar`,
        {
          avatar: newAvatar,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNewAvatarUrl(response.data.url);
      setIsAvatarLoading(false);
    } catch (error) {
      console.log(error);
      setIsAvatarLoading(false);
    }
  };

  const editAvatar = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/user/editAvatar`,
        {
          newAvatarUrl: newAvatarUrl,
        },
        { withCredentials: true }
      );
      setLoggedInUser(response.data.newUser);
      setIsAvatarEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addUserAddressData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/user/addUserAddress`,
        {
          address_field_1: addressField1,
          address_field_2: addressField2,
          state,
          city,
          pincode,
        },
        { withCredentials: true }
      );
      setLoggedInUser(response.data.newUser);
      setIsEditUserAddress(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkPassword();
  }, [currentPassword]);

  useEffect(() => {
    uploadNewAvatar();
  }, [newAvatar]);

  console.log(newAvatar);

  return (
    <>
      <div className="border-2 rounded-lg p-4 flex flex-col  m-10 shadow-lg">
        <div className="text-2xl font-semibold">User profile</div>
        <div className="flex items-center my-4">
          {loggedInUser.avatarurl !== "" && (
            <>
              {isAvatarEdit ? (
                <>
                  <div className="flex flex-col gap-4 items-center">
                    {isAvatarLoading ? (
                      <>
                        <Loader width="44" height="44" />
                      </>
                    ) : (
                      <img
                        className="h-24 md:h-44 rounded-full object-cover"
                        src={newAvatarUrl}
                        alt=""
                      />
                    )}
                    {!isAvatarLoading && (
                      <div className="flex items-center gap-2">
                        <button
                          className="border-2 rounded-lg border-red-500 text-red-500 p-2 hover:bg-red-500 hover:text-white hover:duration-300"
                          onClick={() => setIsAvatarEdit(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="border-2 rounded-lg border-red-500 text-red-500 p-2 hover:bg-red-500 hover:text-white hover:duration-300"
                          onClick={editAvatar}
                        >
                          Edit avatar
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-4 items-center ">
                  <img
                    className="h-24 md:h-44 rounded-full object-cover"
                    src={loggedInUser?.avatarurl}
                    alt="user-image"
                  />
                  <div>
                    <label
                      className="border-2 rounded-lg p-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300"
                      htmlFor="newAvatar"
                    >
                      change avatar
                    </label>
                    <input
                      hidden
                      onChange={(e) => {
                        setNewAvatar(e.target.files![0]);
                        setIsAvatarEdit(true);
                      }}
                      type="file"
                      name="newAvatar"
                      id="newAvatar"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex-col items-center my-4 gap-4">
          <div className="flex gap-4 items-center text-xl my-4">
            <span>Email</span>
            <input
              className="border-2 rounded-lg p-2 bg-blue-100"
              readOnly
              value={loggedInUser.email}
              type="text"
              name=""
              id=""
            />
          </div>
          {!isEditUsername ? (
            <div className="flex gap-4 items-center font-semobold">
              <p className="text-xl">{loggedInUser.username}</p>
              <button
                onClick={() => {
                  setIsEditUsername(true);
                  setNewUsername(loggedInUser.username);
                }}
                className="border-2 rounded-lg border-red-500 text-red-500 p-2 hover:bg-red-500 hover:text-white hover:duration-300"
              >
                edit username
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <form
                onSubmit={(e) => editUsername(e)}
                className="flex items-center gap-4"
              >
                <input
                  className="border-2 rounded-lg p-2 bg-blue-100"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  type="text"
                  name="newUsername"
                  id="newUsername"
                  placeholder="enter new username"
                />
                <button className="border-2 rounded-lg border-red-500 text-red-500 p-2 hover:bg-red-500 hover:text-white hover:duration-300">
                  submit
                </button>
              </form>
              <button
                onClick={() => setIsEditUsername(false)}
                className="border-2 rounded-lg border-red-500 text-red-500 p-2 hover:bg-red-500 hover:text-white hover:duration-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className=" my-4 gap-2">
          <button
            onClick={() => setIsEditPassword(!isEditPassword)}
            className=" text-red-500 hover:underline hover:underline-offset-2"
          >
            {isEditPassword ? "cancel" : "edit password"}
          </button>
          {isEditPassword && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p>Enter current password</p>
                <input
                  className="border-2 rounded-lg p-2 bg-blue-100"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                />
              </div>
              {isPasswordCorrect && (
                <div className="flex flex-col gap-2">
                  <p>Enter new password</p>
                  <form
                    className="flex flex-col gap-2"
                    onSubmit={(e) => editPassword(e)}
                  >
                    <input
                      className="border-2 rounded-lg p-2 bg-blue-100"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      name="newPassword"
                      id="newPassword"
                    />
                    <button className="border-2 rounded-lg p-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300">
                      submit
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 my-4">
          <span className="font-semibold text-xl">User address information</span>
          <button className="text-red-500 hover:underline hover:underline-offset-4" onClick={() => {
            setIsEditUserAddress(!isEditUserAddress);
            setAddressField1(loggedInUser?.address_field_1!);
            setAddressField2(loggedInUser?.address_field_2!);
            setCity(loggedInUser?.city);
            setPincode(loggedInUser?.pincode);
            setState(loggedInUser?.state);
          }}>{isEditUserAddress ? "Cancel" : "Edit"}</button>
        </div>
        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => addUserAddressData(e)}
        >
          <div className="flex flex-col  lg:flex-row lg:items-center gap-4">
            <div className="flex flex-col justify-center lg:w-[50%] gap-4">
              <label className="font-semibold" htmlFor="address_field_1">Address field 1</label>
              {isEditUserAddress ? <input
                value={addressField1}
                onChange={(e) => setAddressField1(e.target.value)}
                className="border-2 rounded-lg p-2 bg-blue-100"
                type="text"
                name="address_field_1"
                id="address_field_1"
                placeholder="eg: J -459, Galaxy apartments"
              /> : <div>{loggedInUser.address_field_1===null ? 'null' :loggedInUser.address_field_1 }</div>}
            </div>
            <div className="flex flex-col justify-center lg:w-[50%] gap-4">
              <label className="font-semibold" htmlFor="address_field_2">Address field 2</label>
              {isEditUserAddress ? <input
                value={addressField2}
                onChange={(e) => setAddressField2(e.target.value)}
                className="border-2 rounded-lg p-2 bg-blue-100"
                type="text"
                name="address_field_2"
                id="address_field_2"
                placeholder="eg:street name , landmarks"
              />: <div>{loggedInUser.address_field_2===null ? 'null' :loggedInUser.address_field_2 }</div>}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex flex-col justify-center lg:w-[25%] gap-4">
              <label className="font-semibold" htmlFor="city">city</label>
              {isEditUserAddress ?  <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border-2 rounded-lg p-2 bg-blue-100"
                type="text"
                name="city"
                id="city"
                placeholder="eg:mumbai"
              /> : <div>{loggedInUser.city===null ? 'null' : loggedInUser.city}</div>}
            </div>
            <div className="flex flex-col justify-center lg:w-[25%] gap-4">
              <label className="font-semibold" htmlFor="pincode"> pincode</label>
              {isEditUserAddress ? <input
                value={pincode}
                onChange={(e) => setPincode(Number(e.target.value))}
                className="border-2 rounded-lg p-2 bg-blue-100"
                type="number"
                name="pincode"
                id="pincode"
                placeholder="400069"
              /> : <div>{loggedInUser.pincode === null ? 'null' : loggedInUser.pincode}</div>}
            </div>
            <div className="flex flex-col justify-center lg:w-[50%] gap-4">
              <label className="font-semibold" htmlFor="state">state</label>
              {isEditUserAddress ?  <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="border-2 rounded-lg p-2 bg-blue-100"
                type="text"
                name="state"
                id="state"
                placeholder="eg: Maharashtra"
              /> : <div>{loggedInUser.state === null ? 'null' : loggedInUser.state}</div>}
            </div>
          </div>
          {isEditUserAddress && <button className="border-2 rounded-lg p-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300">
            Submit
          </button>}
        </form>
      </div>
    </>
  );
};

export default Profile;
