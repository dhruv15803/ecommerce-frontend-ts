import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { backendUrl } from "../App";
import Loader from "../Components/Loader";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isAvatarLoading, setIsAvatarLoading] = useState<boolean>(false);
  const [isUserRegistered, setIsUserRegistered] = useState<boolean>(false);
  const [registerErrorMsg, setRegisterErrorMsg] = useState<string>("");
  const navigate = useNavigate();

  console.log(avatar);

  const uploadAvatar = async () => {
    try {
      if (avatar === "") {
        return;
      }
      setIsAvatarLoading(true);
      const response = await axios.post(
        `${backendUrl}/user/uploadAvatar`,
        {
          avatar,
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
      setAvatarUrl(response.data.url);
    } catch (error: any) {
      setIsAvatarLoading(false);
      console.log(error);
    }
  };

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsUserRegistered(true);
      const response = await axios.post(
        `${backendUrl}/user/register`,
        {
          username,
          email,
          password,
          confirmPassword,
          firstname: firstName,
          lastname: lastName,
          avatar,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setIsUserRegistered(false);
      setUsername("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (error: any) {
      console.log(error);
      setIsUserRegistered(false);
      setRegisterErrorMsg(error.response.data.message);
      setTimeout(() => {
        setRegisterErrorMsg("");
      }, 3000);
    }
  };

  useEffect(() => {
    uploadAvatar();
  }, [avatar]);

  if (isUserRegistered) {
    return (
      <>
        <div className="flex justify-center items-center gap-4 my-36">
          <Loader height="120" width="120" />
          <p className="text-red-500 font-semibold text-4xl">Registering...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="rounded-lg flex justify-center flex-col m-10 p-4">
        <h1 className="text-red-500 font-semibold text-2xl flex justify-center">
          Register
        </h1>
        <form
          onSubmit={(e) => registerUser(e)}
          className="border-2 flex flex-col gap-4  rounded-lg p-2 shadow-lg my-8"
        >
          <div className="flex items-center flex-col gap-4">
            {isAvatarLoading ? (
              <>
                <Loader height="80" width="80" />
              </>
            ) : (
              <>
                {avatarUrl !== "" && (
                  <img className="rounded-full h-48" src={avatarUrl} alt="" />
                )}
              </>
            )}
            {!isAvatarLoading && (
              <div className="flex items-center gap-2">
                <label
                  className="flex items-center gap-2 border-2 rounded-lg p-2 border-red-400 text-red-400 hover:bg-red-500 hover:text-white duration-300"
                  htmlFor="avatar"
                >
                  <FaImage />
                  {avatarUrl !== "" ? "Change" : "Upload"} avatar
                </label>
                {avatar !== "" && (
                  <button
                    onClick={() => {
                      setAvatar("");
                      setAvatarUrl("");
                    }}
                    className="flex items-center gap-2 border-2 rounded-lg p-2 border-red-400 text-red-400 hover:bg-red-500 hover:text-white duration-300"
                  >
                    Remove avatar
                  </button>
                )}
              </div>
            )}
            <input
              onChange={(e) => setAvatar(e.target.files![0])}
              hidden
              type="file"
              name="avatar"
              id="avatar"
            />
          </div>
          <div className="flex items-center gap-4 border-2 mx-[15%] rounded-lg p-4 shadow-lg">
            <div className="flex gap-2 items-center">
              <label className="text-red-400" htmlFor="username">
                Enter username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 rounded-lg p-1"
                type="text"
                placeholder="eg: emily123"
                name="username"
                id="username"
              />
            </div>
            <div className="flex gap-2 items-center">
              <label className="text-red-400" htmlFor="email">
                Enter email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 rounded-lg p-1"
                type="email"
                name="email"
                id="email"
                placeholder="eg: emily123@gmail.com"
              />
            </div>
          </div>
          <div className="flex items-center gap-4   border-2 mx-[15%] rounded-lg p-4 shadow-lg">
            <div className="flex gap-2 items-center">
              <label className="text-red-400" htmlFor="firstname">
                Enter first name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-2 rounded-lg p-1"
                type="text"
                name="firstname"
                id="firstname"
                placeholder="eg: emily"
              />
            </div>
            <div className="flex gap-2 items-center ">
              <label className="text-red-400" htmlFor="lastname">
                Enter last name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-2 rounded-lg p-1"
                type="text"
                name="lastname"
                id="lastname"
                placeholder="eg: stark"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2  border-2 mx-[15%] rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex gap-2 items-center">
                <label className="text-red-400" htmlFor="password">
                  Enter password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 rounded-lg p-1"
                  type={isShowPassword ? "text" : "password"}
                  name="password"
                  id="password"
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-red-400" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-2 rounded-lg p-1"
                  type={isShowPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-red-400">Show password</p>
              <input
                checked={isShowPassword}
                onChange={() => setIsShowPassword(!isShowPassword)}
                type="checkbox"
                name="isShowPassword"
              />
            </div>
          </div>

          <div className="my-4 mx-[15%]">
            Already have an account.{" "}
            <Link to="/login" className="text-red-500">
              Click here
            </Link>
          </div>

          <div className="flex justify-center text-red-400">
            {registerErrorMsg}
          </div>

          <button className="border-2 w-[25%] mx-auto my-4 rounded-lg border-red-400 text-red-400 hover:bg-red-500 hover:text-white hover:duration-300 p-2">
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
