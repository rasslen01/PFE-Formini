import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {

  const [role, setRole] = useState("student");

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">

              {/* Header */}
              <div className="rounded-t mb-0 px-6 py-6 text-center">
                <h6 className="text-blueGray-500 text-sm font-bold">
                  Sign in with credentials
                </h6>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>

              {/* Form */}
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form>

                  {/* Email */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                      placeholder="Email"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                      placeholder="Password"
                    />
                  </div>

                  {/* ROLE SELECTION */}
                  <div className="mt-4 mb-4">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Login as
                    </label>

                    <div className="flex justify-between text-sm text-blueGray-600">

                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value="student"
                          checked={role === "student"}
                          onChange={() => setRole("student")}
                          className="form-radio text-blueGray-700"
                        />
                        <span className="ml-2">Student</span>
                      </label>

                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value="admin"
                          checked={role === "admin"}
                          onChange={() => setRole("admin")}
                          className="form-radio text-blueGray-700"
                        />
                        <span className="ml-2">Admin</span>
                      </label>

                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value="centre"
                          checked={role === "centre"}
                          onChange={() => setRole("centre")}
                          className="form-radio text-blueGray-700"
                        />
                        <span className="ml-2">Centre</span>
                      </label>

                    </div>
                  </div>

                  {/* Remember me */}
                  <div className="mb-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        Remember me
                      </span>
                    </label>
                  </div>

                  {/* Submit */}
                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white text-sm font-bold uppercase px-6 py-3 rounded shadow w-full"
                      type="button"
                      onClick={() => console.log("Login as:", role)}
                    >
                      Sign In
                    </button>
                  </div>

                </form>
              </div>
            </div>

            {/* Footer links */}
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <Link to="/auth/forget" className="text-blueGray-200">
                  <small>Forgot password?</small>
                </Link>
              </div>
              <div className="w-1/2 text-right">
                <Link to="/auth/register" className="text-blueGray-200">
                  <small>Create new account</small>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
