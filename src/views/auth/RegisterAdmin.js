import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { registerUser } from "Services/Apiauth"; // <-- ton apiAuth.js

export default function RegisterAdmin() {
  const history = useHistory();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ payload propre (email minuscule + role ADMIN)
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: "ADMIN",
      };

      const res = await registerUser(payload);
      console.log("✅ REGISTER ADMIN RES:", res.data);

      // ✅ Le backend doit renvoyer token + user
      // Si ton backend renvoie un autre nom (accessToken...), change ici.
      const token = res.data.token;
      const user = res.data.user;

      if (!token) {
        throw new Error("Backend n'a pas renvoyé de token");
      }

      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", "ADMIN");

      // ✅ redirection (choisis ta page admin)
      history.push("/admin/dashboard"); // ou /admin/users
    } catch (err) {
      console.log("❌ REGISTER ADMIN ERROR:", err?.response?.status, err?.response?.data || err.message);
      setError(err?.response?.data?.error || err.message || "Erreur inscription admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 h-full relative z-10">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative flex flex-col w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6 text-center">
              <h6 className="text-blueGray-500 text-sm font-bold">Sign up as Admin</h6>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>

            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="block text-xs font-bold uppercase text-blueGray-600 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blueGray-800 text-white font-bold uppercase px-6 py-3 rounded shadow disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Create Admin Account"}
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-wrap mt-6 relative items-center gap-3">
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

            <div className="w-full flex items-center gap-2 mt-2">
              <Link to="/auth/register" className="text-lightBlue-500">
                Sign up as Student
              </Link>
              <span className="text-blueGray-400">|</span>
              <Link to="/auth/register-centre" className="text-lightBlue-500">
                Sign up as Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}