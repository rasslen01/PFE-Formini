// src/views/auth/ResetPassword.js
// Page accessible via le lien email : /auth/reset-password?token=xxx

import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { resetPassword } from "Services/Apiauth";

export default function ResetPassword() {
  const history  = useHistory();
  const location = useLocation();
  const token    = new URLSearchParams(location.search).get("token");

  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass,        setShowPass]        = useState(false);
  const [status,          setStatus]          = useState("idle");
  const [message,         setMessage]         = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setStatus("error");
      setMessage("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await resetPassword(token, password);
      setStatus("success");
      setMessage(res.data?.message || "Mot de passe modifié !");
      setTimeout(() => history.push("/auth/login"), 3000);
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.error || "Lien invalide ou expiré. Refaites une demande.");
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-blueGray-600 mb-4">Lien invalide.</p>
          <Link to="/auth/forget" className="text-lightBlue-500 font-bold">
            Refaire une demande
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">

            <div className="rounded-t mb-0 px-6 py-6 text-center">
              <div className="text-5xl mb-3">🔑</div>
              <h2 className="text-blueGray-700 text-xl font-bold">Nouveau mot de passe</h2>
              <p className="text-blueGray-500 text-sm mt-2">
                Choisissez un nouveau mot de passe sécurisé.
              </p>
            </div>

            <div className="flex-auto px-4 lg:px-10 py-6 pt-0">

              {/* Succès */}
              {status === "success" && (
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 px-4 py-4 rounded-lg text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="font-semibold">{message}</p>
                  <p className="text-sm mt-1">Redirection vers la connexion...</p>
                </div>
              )}

              {/* Erreur */}
              {status === "error" && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                  <i className="fas fa-exclamation-circle mr-2" />{message}
                </div>
              )}

              {status !== "success" && (
                <form onSubmit={handleSubmit}>
                  {/* Nouveau mot de passe */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full focus:outline-none focus:ring-2 focus:ring-lightBlue-400 pr-10"
                        placeholder="Minimum 6 caractères"
                        required
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute inset-y-0 right-0 px-3 text-blueGray-400 hover:text-blueGray-600">
                        <i className={`fas ${showPass ? "fa-eye-slash" : "fa-eye"}`} />
                      </button>
                    </div>
                    {/* Force du mot de passe */}
                    {password && (
                      <div className="mt-1">
                        <div className="h-1 rounded-full bg-blueGray-200">
                          <div className={`h-1 rounded-full transition-all ${
                            password.length < 6  ? "w-1/4 bg-red-400" :
                            password.length < 10 ? "w-2/4 bg-amber-400" :
                                                    "w-full bg-emerald-400"
                          }`} />
                        </div>
                        <p className={`text-xs mt-1 ${
                          password.length < 6  ? "text-red-400" :
                          password.length < 10 ? "text-amber-400" :
                                                  "text-emerald-500"
                        }`}>
                          {password.length < 6  ? "Trop court" :
                           password.length < 10 ? "Moyen" : "Fort ✓"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirmer */}
                  <div className="relative w-full mb-5">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type={showPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`border-0 px-3 py-3 bg-white rounded text-sm shadow w-full focus:outline-none focus:ring-2 ${
                        confirmPassword && confirmPassword !== password
                          ? "ring-2 ring-red-400 focus:ring-red-400"
                          : "focus:ring-lightBlue-400"
                      }`}
                      placeholder="Répétez le mot de passe"
                      required
                    />
                    {confirmPassword && confirmPassword !== password && (
                      <p className="text-red-500 text-xs mt-1">
                        <i className="fas fa-exclamation-triangle mr-1" />
                        Ne correspond pas
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className={`bg-blueGray-800 text-white text-sm font-bold uppercase px-6 py-3 rounded shadow w-full hover:shadow-lg transition-all ${
                      status === "loading" ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {status === "loading" ? (
                      <><i className="fas fa-spinner fa-spin mr-2" />Modification...</>
                    ) : (
                      <><i className="fas fa-lock mr-2" />Modifier mon mot de passe</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <Link to="/auth/login" className="text-blueGray-200 hover:text-white text-sm">
              <i className="fas fa-arrow-left mr-1" /> Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}