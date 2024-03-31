import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext, backendUrl } from "../App";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState<string>("");
  const { setIsLoggedIn, setLoggedInUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        `${backendUrl}/user/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(response);
      setLoggedInUser(response.data.user);
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      setLoginErrorMsg(error.response.data.message);
      setTimeout(() => {
        setLoginErrorMsg("");
      }, 3000);
    }
  };

  return (
    <>
      <div className="rounded-lg flex flex-col m-10 p-4 gap-6">
        <h1 className="text-red-500 font-semibold text-2xl flex justify-center">
          Login
        </h1>
        <form
          onSubmit={(e) => loginUser(e)}
          className="flex flex-col  border-2 gap-4 rounded-lg p-4 shadow-lg"
        >
          <div className="flex flex-col gap-2">
            <label className="text-red-400" htmlFor="email">
              Enter email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 rounded-lg p-2"
              type="email"
              name="email"
              id="email"
              placeholder="eg:emily123@gmail.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-red-400" htmlFor="password">
              Enter password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 rounded-lg p-2"
              type={isShowPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="eg: emily@gmail.com"
            />
            <div className="flex items-center gap-2">
              <p>Show password</p>
              <input
                checked={isShowPassword}
                onChange={() => setIsShowPassword(!isShowPassword)}
                type="checkbox"
                name=""
                id=""
              />
            </div>
          </div>
          <div>
            Don't have an account.
            <Link className="text-red-500" to="/register">
              Click here
            </Link>
          </div>
          <div className="text-red-500">{loginErrorMsg}</div>
          <button className="border-2 rounded-lg p-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
