import React, { useContext, useEffect, useState } from "react";
import { GlobalContext, User, backendUrl } from "../App";
import bcrypt from "bcryptjs-react";
import axios from "axios";

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

  useEffect(() => {
    checkPassword();
  }, [currentPassword]);

  return (
    <>
      <div className="border-2 rounded-lg p-2 flex flex-col items-center m-10 shadow-lg">
        <div className="flex items-center my-4">
          <img
            className="h-44 rounded-full"
            src={loggedInUser?.avatarurl}
            alt="user-image"
          />
        </div>
        <div className="flex items-center my-4 gap-4">
          <div className="text-2xl font-semibold">{loggedInUser.email}</div>
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
