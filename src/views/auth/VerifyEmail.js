// src/views/auth/VerifyEmail.js
// Page accessible via le lien email : /auth/verify-email?token=xxx

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { verifyEmail, resendVerifyEmail } from "Services/Apiauth";

export default function VerifyEmail() {
  const location = useLocation();
  const token    = new URLSearchParams(location.search).get("token");

  const [status,       setStatus]       = useState("loading"); // loading | success | error | resend
  const [message,      setMessage]      = useState("");
  const [resendEmail,  setResendEmail]  = useState("");
  const [resendStatus, setResendStatus] = useState("idle");

  useEffect(() => {
    if (!token) { setStatus("error"); setMessage("Lien invalide."); return; }

    verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.data?.message || "Email vérifié !");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.error || "Lien invalide ou expiré.");
      });
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;
    setResendStatus("loading");
    try {
      await resendVerifyEmail(resendEmail.trim());
      setResendStatus("success");
    } catch (err) {
      setResendStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-5/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0 p-8 text-center">

            {/* Loading */}
            {status === "loading" && (
              <>
                <i className="fas fa-spinner fa-spin text-5xl text-lightBlue-500 mb-4" />
                <h2 className="text-xl font-bold text-blueGray-700">Vérification en cours...</h2>
              </>
            )}

            {/* Succès */}
            {status === "success" && (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-emerald-600 mb-2">Email vérifié !</h2>
                <p className="text-blueGray-500 mb-6">{message}</p>
                <p className="text-blueGray-500 mb-6">
                  Votre compte est maintenant actif. Bienvenue sur Formini !
                </p>
                <Link
                  to="/auth/login"
                  className="bg-lightBlue-500 text-white font-bold uppercase text-sm px-8 py-3 rounded shadow hover:shadow-lg transition-all inline-block"
                >
                  <i className="fas fa-sign-in-alt mr-2" />
                  Se connecter
                </Link>
              </>
            )}

            {/* Erreur */}
            {status === "error" && (
              <>
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-xl font-bold text-red-500 mb-2">Lien invalide ou expiré</h2>
                <p className="text-blueGray-500 mb-6">{message}</p>

                {/* Renvoyer l'email */}
                <div className="border-t pt-6 mt-2">
                  <p className="text-blueGray-600 font-semibold mb-3">
                    Recevoir un nouveau lien de vérification :
                  </p>

                  {resendStatus === "success" ? (
                    <div className="bg-emerald-100 text-emerald-700 px-4 py-3 rounded text-sm">
                      <i className="fas fa-check-circle mr-2" />
                      Email renvoyé ! Vérifiez votre boîte mail.
                    </div>
                  ) : (
                    <form onSubmit={handleResend} className="flex gap-2">
                      <input
                        type="email"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="border rounded px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-400"
                        required
                      />
                      <button
                        type="submit"
                        disabled={resendStatus === "loading"}
                        className="bg-lightBlue-500 text-white text-sm font-bold px-4 py-2 rounded hover:bg-lightBlue-600 transition-all whitespace-nowrap"
                      >
                        {resendStatus === "loading"
                          ? <i className="fas fa-spinner fa-spin" />
                          : "Renvoyer"}
                      </button>
                    </form>
                  )}
                </div>
              </>
            )}

          </div>

          <div className="flex justify-center">
            <Link to="/auth/login" className="text-blueGray-200 hover:text-white text-sm">
              <i className="fas fa-arrow-left mr-1" /> Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}