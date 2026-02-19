import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterCentre() {
  const [formData, setFormData] = useState({
    centreName: "",
    email: "",
    password: "",
    address: "",
    description: "",
    role: "centre",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Centre data:", formData);
  };

  return (
    <div className="container mx-auto px-4 h-full relative z-10">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative flex flex-col w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">

            {/* Header */}
            <div className="rounded-t mb-0 px-6 py-6 text-center">
              <h6 className="text-blueGray-500 text-sm font-bold">
                Sign up as Training Center
              </h6>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>

            {/* Form */}
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="block text-xs font-bold uppercase text-blueGray-600 mb-2">
                    Center Name
                  </label>
                  <input
                    type="text"
                    name="centreName"
                    placeholder="Center Name"
                    value={formData.centreName}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded shadow bg-white"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-bold uppercase text-blueGray-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded shadow bg-white"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-bold uppercase text-blueGray-600 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded shadow bg-white"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-bold uppercase text-blueGray-600 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Adress"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded shadow bg-white"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-bold uppercase text-blueGray-600 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded shadow bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blueGray-800 text-white font-bold uppercase px-6 py-3 rounded shadow"
                >
                  Create Center Account
                </button>
              </form>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap mt-6 relative">

  <div className="w-1/2">
    <Link to="/auth/forget" className="text-blueGray-200">
      <small>Forgot password?</small>
    </Link>
  </div>

  <div className="w-1/2 text-right">
    <Link to="/auth/login" className="text-blueGray-200">
      <small>Login</small>
    </Link>
  </div>

</div>

            <Link to="/auth/register" className="text-lightBlue-500">
              Sign up as Student
            </Link>
            <span className="text-blueGray-400">|</span>
                        <Link to="/auth/register-admin" className="text-lightBlue-500">
                          Sign up as Admin
                        </Link>
          </div>
        </div>
      </div>
    
  );
}
