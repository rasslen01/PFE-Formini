// ═══════════════════════════════════════════════
// 📁 src/views/auth/Register.js
// ═══════════════════════════════════════════════

import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { registerUser } from "Services/Apiauth";
import { useRef , useEffect } from "react";

export default function Register() {
  const isMounted = useRef(true);

useEffect(() => {
  return () => {
    isMounted.current = false;
  };
}, []);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    speciality: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Effacer l'erreur du champ modifié
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // ─────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─────────────────────────────────────────
  // Soumission
  // ─────────────────────────────────────────
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setIsLoading(true);

  try {
    const response = await registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role.toUpperCase(),
      speciality: formData.speciality
    });

   console.log("✅ Registered:", response.data);

// ✅ récupérer token + user depuis la réponse backend
const token = response.data?.token || response.data?.accessToken;
const user = response.data?.user || response.data?.newUser || response.data?.data?.user;

// si backend renvoie token + user → on auto-login
if (token && user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("role", user.role || formData.role.toUpperCase());

  history.push("/preferences");
  return;
}

// fallback (si backend ne renvoie pas token/user)
history.push("/auth/login");

  } catch (error) {
    setErrors({
      general:
        error.response?.data?.error ||
        "Erreur lors de l'inscription."
    });
  } finally {
  if (isMounted.current) {
    setIsLoading(false);
  }
}
};

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">

              {/* Header */}
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Sign up as Student
                  </h6>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>

              {/* Form */}
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Create student account</small>
                </div>

                {/* ══════════════════════════════
                    Erreur générale
                   ══════════════════════════════ */}
                {errors.general && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* Name */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`border-0 px-3 py-3 bg-white rounded text-sm shadow w-full focus:outline-none focus:ring ${
                        errors.name ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="Name"
                      required
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        <i className="fas fa-exclamation-triangle mr-1"></i>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
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
                      value={formData.password}
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

                  {/* Confirm Password */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`border-0 px-3 py-3 bg-white rounded text-sm shadow w-full focus:outline-none focus:ring ${
                        errors.confirmPassword ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="Confirm Password"
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        <i className="fas fa-exclamation-triangle mr-1"></i>
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Speciality */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Speciality
                    </label>
                    <input
                      type="text"
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full focus:outline-none focus:ring"
                      placeholder="Ex: Informatique, Marketing..."
                    />
                  </div>

                  {/* ══════════════════════════════════
                      Info redirection préférences
                     ══════════════════════════════════ */}
                  <div className="bg-lightBlue-50 border border-lightBlue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-lightBlue-700">
                      <i className="fas fa-info-circle mr-1"></i>
                      After registration, you will be redirected to a{" "}
                      <strong>preferences form</strong> to personalize your
                      learning experience.
                    </p>
                  </div>

                  {/* Privacy Policy */}
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckRegister"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                        required
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        I agree with the{" "}
                        <a href="#" className="text-lightBlue-500">
                          Privacy Policy
                        </a>
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
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus mr-2"></i>
                          Create Student Account
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>

            {/* Footer Links */}
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

              <div className="w-full text-center mt-4 space-x-4">
                <Link to="/auth/register-admin" className="text-lightBlue-500">
                  <small>Sign up as Admin</small>
                </Link>
                <span className="text-blueGray-400">|</span>
                <Link to="/auth/register-centre" className="text-lightBlue-500">
                  <small>Sign up as Training Center</small>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}