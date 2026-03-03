import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { registerUser } from "Services/Apiauth";

export default function RegisterCentre() {
  const history = useHistory();

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    centreName: "",
    email: "",
    password: "",
    address: "",
    description: "",
    role: "centre",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear field/general errors when typing
    if (errors[name] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.centreName.trim()) newErrors.centreName = "Center name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Minimum 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const payload = {
        // mapping centreName → name (backend usually expects "name")
        name: formData.centreName.trim(),
        email: formData.email.trim(),
        password: formData.password,

        // role in uppercase to match backend logic
        role: "CENTRE",

        // extra fields (backend may ignore if not in schema)
        address: formData.address?.trim() || "",
        description: formData.description?.trim() || "",
      };

      const response = await registerUser(payload);
      console.log("✅ Centre registered:", response.data);

      // ✅ stable flow: after register centre -> login
      history.push("/auth/login");
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Registration failed.";

      console.error("❌ Register centre error:", error.response?.data || error.message);

      if (isMounted.current) {
        setErrors({ general: msg });
      }
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
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
              {errors.general && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {errors.general}
                </div>
              )}

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
                    className={`w-full px-3 py-3 rounded shadow bg-white focus:outline-none ${
                      errors.centreName ? "ring-2 ring-red-500" : ""
                    }`}
                    required
                  />
                  {errors.centreName && (
                    <p className="text-red-500 text-xs mt-1">{errors.centreName}</p>
                  )}
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
                    className={`w-full px-3 py-3 rounded shadow bg-white focus:outline-none ${
                      errors.email ? "ring-2 ring-red-500" : ""
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
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
                    className={`w-full px-3 py-3 rounded shadow bg-white focus:outline-none ${
                      errors.password ? "ring-2 ring-red-500" : ""
                    }`}
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-bold uppercase text-blueGray-600 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded shadow bg-white focus:outline-none"
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
                    className="w-full px-3 py-3 rounded shadow bg-white focus:outline-none"
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-blueGray-800 text-white font-bold uppercase px-6 py-3 rounded shadow ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Creating..." : "Create Center Account"}
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

          <div className="mt-3 flex flex-wrap items-center gap-2">
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
    </div>
  );
}