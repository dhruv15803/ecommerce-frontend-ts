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

  useEffect(() => {
    checkPassword();
  }, [currentPassword]);

  useEffect(() => {
    uploadNewAvatar();
  }, [newAvatar]);

  console.log(newAvatar);
  return (
    <>
      <div className="border-2 rounded-lg p-4 flex flex-col items-center  m-10 shadow-lg">
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
                    {!isAvatarLoading && <div className="flex items-center gap-2">
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
                    </div>}
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
          <div className="text-2xl font-semibold my-4">
            {loggedInUser.email}
          </div>
          {!isEditUsername ? (
            <div className="flex gap-4 items-center font-semobold">
              <p className="text-2xl">{loggedInUser.username}</p>
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
                  className="border-2 rounded-lg p-2"
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
        <div className="flex flex-col items-center my-4 gap-2">
          <button
            onClick={() => setIsEditPassword(!isEditPassword)}
            className="text-red-500 hover:underline hover:underline-offset-2"
          >
            {isEditPassword ? "cancel" : "edit password"}
          </button>
          {isEditPassword && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p>Enter current password</p>
                <input
                  className="border-2 rounded-lg p-2"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                />
              </div>
              {isPasswordCorrect && (
                <div className="flex items-center gap-2">
                  <p>Enter new password</p>
                  <form onSubmit={(e) => editPassword(e)}>
                    <input
                      className="border-2 rounded-lg p-2"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      name="newPassword"
                      id="newPassword"
                    />
                    <button>submit</button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
