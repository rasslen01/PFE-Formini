// src/views/auth/forget.js — Forgot Password

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "Services/Apiauth";

export default function ForgotPassword() {
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await forgotPassword(email.trim());
      setStatus("success");
      setMessage(res.data?.message || "Lien envoyé !");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.error || "Erreur lors de l'envoi. Réessayez.");
    }
  };

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">

            {/* Header */}
            <div className="rounded-t mb-0 px-6 py-6 text-center">
              <div className="text-5xl mb-3">🔐</div>
              <h2 className="text-blueGray-700 text-xl font-bold">Mot de passe oublié ?</h2>
              <p className="text-blueGray-500 text-sm mt-2">
                Entrez votre email, on vous envoie un lien de réinitialisation.
              </p>
            </div>

            <div className="flex-auto px-4 lg:px-10 py-6 pt-0">

              {/* Succès */}
              {status === "success" && (
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 px-4 py-4 rounded-lg mb-4 text-center">
                  <div className="text-3xl mb-2">📧</div>
                  <p className="font-semibold">{message}</p>
                  <p className="text-sm mt-1 text-emerald-600">
                    Vérifiez votre boîte mail (et vos spams).
                  </p>
                </div>
              )}

              {/* Erreur */}
              {status === "error" && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                  <i className="fas fa-exclamation-circle mr-2" />
                  {message}
                </div>
              )}

              {status !== "success" && (
                <form onSubmit={handleSubmit}>
                  <div className="relative w-full mb-4">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full focus:outline-none focus:ring-2 focus:ring-lightBlue-400"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className={`bg-blueGray-800 text-white text-sm font-bold uppercase px-6 py-3 rounded shadow w-full hover:shadow-lg transition-all duration-150 ${
                      status === "loading" ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {status === "loading" ? (
                      <><i className="fas fa-spinner fa-spin mr-2" />Envoi en cours...</>
                    ) : (
                      <><i className="fas fa-paper-plane mr-2" />Envoyer le lien</>
                    )}
                  </button>
                </form>
              )}

              {status === "success" && (
                <button
                  onClick={() => { setStatus("idle"); setEmail(""); setMessage(""); }}
                  className="mt-3 w-full text-center text-sm text-blueGray-500 hover:text-blueGray-700"
                >
                  Renvoyer un lien
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap mt-2 relative justify-center">
            <Link to="/auth/login" className="text-blueGray-200 hover:text-white text-sm">
              <i className="fas fa-arrow-left mr-1" /> Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}