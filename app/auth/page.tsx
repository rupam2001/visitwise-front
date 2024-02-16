"use client";
import * as React from "react";
import Image from "next/image";
import logo from "../../public/logo.png";
import { ENDPOINT } from "../constants";
import {
  extractFormData,
  saveAuthToken,
  getAuthToken,
  getAuthHeaders,
  getHeaders,
} from "../utils";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface messageType {
  text: String;
  success: boolean;
}

export default function Auth() {
  const [mode, setMode] = React.useState<String>("REGISTER");
  const [message, setMessage] = React.useState<messageType>({
    text: "",
    success: true,
  });

  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = extractFormData(event);

    console.log(data);

    try {
      if (mode === "REGISTER") {
        if (data["password"] != data["confPassword"]) {
          alert("password missmatched");
          return;
        }
        delete data["confPassword"];

        const res = await fetch(ENDPOINT + "/user/owner/", {
          headers: getHeaders(),
          method: "POST",
          body: JSON.stringify(data),
        }).then((r) => r.json());

        console.log(res);

        if (res.success) {
          // auto login for the token
          const res = await login(data);
          console.log(res);

          if (res.success) {
            //to organization form
            saveAuthToken(res.data.token);
            setMode("ORGANIZATION");
            return;
          }
        }
      } else if (mode === "LOGIN") {
        const res = await login(data);
        if (res.success) {
          saveAuthToken(res.data.token);
          const { role } = res.data;
          if (role === "OWNER" || role === "ADMIN")
            router.replace("/admin/organization");
          if (role === "EMPLOYEE") router.replace("/home");
          if (role === "SECURITY") router.replace("/security/dashboard");
        }
      } else if (mode == "ORGANIZATION") {
        // for oranization creation
        const token = getAuthToken();
        const res = await fetch(ENDPOINT + "/organization/", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        }).then((r) => r.json());
        if (res.success) {
          //to home page

          router.replace("/home");
        }
      }
    } catch (error) {
      alert("Something went wrong :(");
      console.error(error);
    }
  };

  const login = async (data: { [key: string]: string }) => {
    delete data["confPassword"];
    delete data["first_name"];
    delete data["last_name"];

    const res = await fetch(ENDPOINT + "/user/login/", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }).then((r) => r.json());

    console.log(res, "response");

    return res;
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] p-4 w-1/3 min-h-96 rounded-lg flex flex-col justify-center">
        {mode == "ORGANIZATION" && (
          <form
            className="w-full flex flex-col items-center"
            onSubmit={onSubmit}
          >
            <Image src={logo} alt="Visit Wise" width={150} />
            <div className="divider">{mode}</div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-slate-900">
                  What is your organization name?
                </span>
              </div>
              <input
                type="text"
                placeholder=""
                className="input input-bordered w-full max-w-xs bg-transparent outline-none "
                name="name"
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-slate-900">
                  Organization email:
                </span>
              </div>
              <input
                type="email"
                placeholder=""
                className="input input-bordered w-full max-w-xs bg-transparent outline-none "
                name="email"
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-slate-900">About:</span>
              </div>
              <textarea
                className="textarea textarea-bordered"
                placeholder=""
                name="about"
              ></textarea>
            </label>
            <button
              className="btn btn-wide mt-4 bg-primary_purple text-white hover:bg-primary_purple"
              type="submit"
            >
              Submit
            </button>
          </form>
        )}

        {(mode == "REGISTER" || mode == "LOGIN") && (
          <form
            className="w-full flex flex-col items-center"
            onSubmit={onSubmit}
          >
            <Image src={logo} alt="Visit Wise" width={150} />
            <div className="divider">{mode}</div>
            {mode == "REGISTER" && (
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-slate-900">
                    What is your first name?
                  </span>
                </div>
                <input
                  type="text"
                  placeholder=""
                  className="input input-bordered w-full max-w-xs bg-transparent outline-none "
                  name="first_name"
                />
              </label>
            )}
            {mode == "REGISTER" && (
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-slate-900">last name?</span>
                </div>
                <input
                  type="text"
                  placeholder=""
                  className="input input-bordered w-full max-w-xs bg-transparent outline-none "
                  name="last_name"
                />
              </label>
            )}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-slate-900">Email</span>
              </div>
              <input
                type="email"
                placeholder=""
                className="input input-bordered w-full max-w-xs bg-transparent outline-none "
                name="email"
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-slate-900">Password</span>
              </div>
              <input
                type="password"
                placeholder=""
                className="input input-bordered w-full max-w-xs bg-transparent outline-none "
                name="password"
              />
            </label>
            {mode == "REGISTER" && (
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-slate-900">
                    Confirm password
                  </span>
                </div>
                <input
                  type="password"
                  placeholder=""
                  className="input input-bordered w-full max-w-xs bg-transparent outline-none "
                  name="confPassword"
                />
              </label>
            )}
            {mode == "REGISTER" && (
              <button
                className="btn btn-wide mt-4 bg-primary_purple text-white hover:bg-primary_purple"
                type="submit"
              >
                Register
              </button>
            )}
            {mode == "LOGIN" && (
              <button
                className="btn btn-wide mt-4 bg-primary_purple text-white hover:bg-primary_purple"
                type="submit"
              >
                Login
              </button>
            )}
            <div className="w-full my-4">
              {mode == "REGISTER" && (
                <p
                  className="underline cursor-pointer"
                  onClick={() => setMode("LOGIN")}
                >
                  Login instead?
                </p>
              )}
              {mode == "LOGIN" && (
                <p
                  className="underline cursor-pointer"
                  onClick={() => setMode("REGISTER")}
                >
                  Register instead?
                </p>
              )}
            </div>
          </form>
        )}
        <div
          className={`${
            message.success ? "text-green-600" : "text-red-500"
          } flex justify-center`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}
