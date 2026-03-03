import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { loginUser } from "Services/Apiauth";
import axios from "axios";

export default function Login() {
  const history = useHistory();
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!user.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = "Invalid email";

    if (!user.password) newErrors.password = "Password is required";
    else if (user.password.length < 6) newErrors.password = "Minimum 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await loginUser({
        email: user.email.trim(),
        password: user.password,
        role: role.toUpperCase(),
      });

      const token = response.data?.token;
      const loggedUser = response.data?.user;

      // ✅ normalize role from backend (source of truth)
      const normalizedRole = (loggedUser?.role || role || "").toString().toLowerCase();

      console.log("✅ Login successful:", response.data);

      // ✅ Save session
      if (token) localStorage.setItem("token", token);
      if (loggedUser) localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("role", normalizedRole);

      // ✅ If centre: check status (pending/accepted/rejected)
      if (normalizedRole === "centre") {
        try {
          // adapte URL si ton prefix différent
          const centresRes = await axios.get("http://localhost:5000/centres/getAllCentres");
          const centresList = centresRes.data?.centresList || [];

          const centre = centresList.find(
            (c) => (c.email || "").toLowerCase() === (loggedUser?.email || "").toLowerCase()
          );

          if (!centre) {
            setErrors({ general: "Centre profile not found. Please contact admin." });
            setIsLoading(false);
            return;
          }

          if (centre.status !== "accepted") {
            history.push("/centre/pending");
            return;
          }

          history.push("/centre/dashboard");
          return;
        } catch (err) {
          console.error("❌ Centre status check failed:", err.response?.data || err.message);
          setErrors({ general: "Unable to verify centre status. Try again." });
          return;
        }
      }

      // ✅ Redirect by role
      switch (normalizedRole) {
        case "admin":
          history.push("/admin/dashboard");
          break;
        case "student":
        default:
          history.push("/landing");
          break;
      }
    } catch (error) {
      console.error("❌ Login failed:", error);

      if (error.response) {
        switch (error.response.status) {
          case 401:
            setErrors({ general: "Incorrect email or password" });
            break;
          case 403:
            setErrors({ general: "Access denied for this role" });
            break;
          case 404:
            setErrors({ general: "Account not found" });
            break;
          default:
            setErrors({ general: "Server error. Please try again." });
        }
      } else {
        setErrors({ general: "Network error. Check your connection." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("🔵 Login with Google as:", role);
  };

  const handleFacebookLogin = () => {
    console.log("🔵 Login with Facebook as:", role);
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              {/* Header + Social */}
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">Sign in with</h6>
                </div>

                <div className="btn-wrapper text-center flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="text-blueGray-500 bg-transparent border-none font-bold text-sm px-4 py-2 rounded inline-flex items-center justify-center hover:text-red-500 hover:underline transition-all duration-150"
                    style={{ minWidth: "150px" }}
                  >
                    <img
                      alt="Google"
                      className="w-5 mr-2"
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    />
                    Google
                  </button>

                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    className="text-blueGray-500 bg-transparent border-none font-bold text-sm px-4 py-2 rounded inline-flex items-center justify-center hover:text-blue-600 hover:underline transition-all duration-150"
                    style={{ minWidth: "150px" }}
                  >
                    <i className="fab fa-facebook-f text-blue-600 mr-2 text-lg"></i>
                    Facebook
                  </button>
                </div>

                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>

              {/* Form */}
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Or sign in with credentials</small>
                </div>

                {errors.general && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  {/* Email */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className={`border-0 px-3 py-3 bg-white rounded text-sm shadow w-full focus:outline-none focus:ring ${
                        errors.email ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="Email"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        <i className="fas fa-exclamation-triangle mr-1"></i>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      className={`border-0 px-3 py-3 bg-white rounded text-sm shadow w-full focus:outline-none focus:ring ${
                        errors.password ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="Password"
                      required
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        <i className="fas fa-exclamation-triangle mr-1"></i>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Role Selection */}
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
                          className="form-radio text-lightBlue-500"
                        />
                        <span className="ml-2">
                          <i className="fas fa-user-graduate mr-1"></i> Student
                        </span>
                      </label>

                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value="admin"
                          checked={role === "admin"}
                          onChange={() => setRole("admin")}
                          className="form-radio text-orange-500"
                        />
                        <span className="ml-2">
                          <i className="fas fa-user-shield mr-1"></i> Admin
                        </span>
                      </label>

                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value="centre"
                          checked={role === "centre"}
                          onChange={() => setRole("centre")}
                          className="form-radio text-purple-500"
                        />
                        <span className="ml-2">
                          <i className="fas fa-building mr-1"></i> Centre
                        </span>
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
                      type="submit"
                      disabled={isLoading}
                      className={`bg-blueGray-800 text-white text-sm font-bold uppercase px-6 py-3 rounded shadow w-full hover:shadow-lg transition-all duration-150 ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Signing in...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt mr-2"></i>
                          Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
                        </>
                      )}
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