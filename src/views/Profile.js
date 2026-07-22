// ═══════════════════════════════════════════════
// src/views/Profile.js
// Profil étudiant avec section XP + Badges API
// ═══════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import StudentNavbar from "components/Navbars/StudentNavbar";
import Footer from "components/Footers/Footer.js";
import { Link } from "react-router-dom";
import XPProgressBar from "components/Cards/Xpprogressbar";
import { getMyXP } from "../Services/ApiBadges";
import ChatbotWidget from "components/Chatbot/ChatbotWidget";

const DEFAULT_PROFILE = {
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  city: "",
  country: "",
  about: "",
  skills: [],
  avatar: null,
};

const safeParse = (value) => {
  try { return JSON.parse(value); }
  catch { return null; }
};

const buildExtraKey = (userId) => `profile_extra_${userId}`;

export default function Profile() {
  const [profile, setProfile]   = useState(DEFAULT_PROFILE);
  const [xpData, setXpData]     = useState(null);
  const [loadingXP, setLoadingXP] = useState(true);

  // ── Chargement profil local ──────────────────
  useEffect(() => {
    const storedUser = safeParse(localStorage.getItem("user"));
    if (!storedUser?._id) { setProfile(DEFAULT_PROFILE); return; }

    const fullName           = storedUser.name || "";
    const parts              = fullName.trim().split(" ");
    const firstNameFromName  = parts[0] || "";
    const lastNameFromName   = parts.slice(1).join(" ") || "";
    const extraKey           = buildExtraKey(storedUser._id);
    const extras             = safeParse(localStorage.getItem(extraKey)) || {};

    // ⚠️  Priorité : donnees de la base (storedUser) > extras du meme user
    // extras n est valide que si c est bien le meme userId
    const extrasAreMine = extras._userId === storedUser._id;
    const safeExtras    = extrasAreMine ? extras : {};

    setProfile({
      // username : pas en base => on prend extras sinon email
      username:  safeExtras.username  ?? storedUser.email?.split("@")[0] ?? "",
      email:     storedUser.email || "",
      // firstName/lastName : viennent TOUJOURS du champ name en base en premier
      firstName: firstNameFromName  || safeExtras.firstName || "",
      lastName:  lastNameFromName   || safeExtras.lastName  || "",
      // les autres champs : base d abord, extras ensuite
      city:      storedUser.city    || safeExtras.city    || "",
      country:   safeExtras.country ?? storedUser.country ?? "",
      about:     safeExtras.about   ?? storedUser.about   ?? "",
      skills:    storedUser.skills  || safeExtras.skills  || [],
      avatar:    safeExtras.avatar
        ? safeExtras.avatar
        : storedUser.user_Image
        ? storedUser.user_Image.startsWith("data:")
          ? storedUser.user_Image
          : `http://localhost:5000/uploads/${storedUser.user_Image}?t=${Date.now()}`
        : null,
    });
  }, []);

  // ── Chargement XP + Badges depuis l'API ──────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoadingXP(false); return; }

    getMyXP()
      .then((r) => setXpData(r.data))
      .catch(() => setXpData(null))
      .finally(() => setLoadingXP(false));
  }, []);

  return (
    <>
      <StudentNavbar />
      <main className="profile-page">
        {/* ── Bandeau haut ──────────────────────── */}
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&auto=format&fit=crop&w=2710&q=80')",
            }}
          >
            <span className="w-full h-full absolute opacity-50 bg-black" />
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
            style={{ transform: "translateZ(0)" }}
          >
            <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 2560 100">
              <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100" />
            </svg>
          </div>
        </section>

        {/* ── Carte profil ──────────────────────── */}
        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">

                {/* Avatar + stats */}
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative -mt-20 z-20">
                      <img
                        src={profile.avatar || require("assets/img/team-2-800x800.jpg").default}
                        alt="avatar"
                        className="shadow-xl rounded-full object-cover border-4 border-white bg-white"
                        style={{ width: "150px", height: "150px" }}
                        onError={(e) => { e.currentTarget.src = require("assets/img/team-2-800x800.jpg").default; }}
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {profile.skills?.length || 0}
                        </span>
                        <span className="text-sm text-blueGray-400">Compétences</span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {xpData?.badges?.length || 0}
                        </span>
                        <span className="text-sm text-blueGray-400">Badges</span>
                      </div>
                      {xpData && (
                        <div className="p-3 text-center">
                          <span className="text-xl font-bold block uppercase tracking-wide text-amber-500">
                            {(xpData.xp || 0).toLocaleString()}
                          </span>
                          <span className="text-sm text-blueGray-400">XP</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <Link
                        to="/settingsStudents"
                        className="bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                      >
                        ✏️ Modifier
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Nom + infos */}
                <div className="text-center mt-12">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-sm text-blueGray-500 mb-1">@{profile.username}</p>
                  {(profile.city || profile.country) && (
                    <div className="text-sm leading-normal mt-2 mb-2 text-blueGray-400 font-bold uppercase">
                      <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400" />
                      {profile.city}{profile.city && profile.country ? ", " : ""}{profile.country}
                    </div>
                  )}
                  {profile.email && (
                    <div className="mb-2 text-blueGray-600 mt-4">
                      <i className="fas fa-envelope mr-2 text-lg text-blueGray-400" />
                      {profile.email}
                    </div>
                  )}
                </div>

                {/* ── Barre XP ────────────────────── */}
                <div className="mt-8 px-4 lg:px-16">
                  <XPProgressBar />
                </div>

                {/* ── Badges depuis API ────────────── */}
                {!loadingXP && xpData?.badges?.length > 0 && (
                  <div className="mt-10 py-8 border-t border-blueGray-200">
                    <div className="text-center mb-6">
                      <h4 className="text-blueGray-500 text-sm font-bold uppercase">
                        <i className="fas fa-award text-amber-500 mr-2" />
                        Mes Badges ({xpData.badges.length})
                      </h4>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 px-4">
                      {xpData.badges.map((badge) => (
                        <div
                          key={badge._id}
                          className="flex flex-col items-center gap-1 px-5 py-4 rounded-2xl border-2 border-blueGray-100 shadow-sm hover:shadow-md hover:scale-105 transition-all bg-white cursor-default"
                          title={badge.description}
                        >
                          <span className="text-3xl">{badge.icon || "🏅"}</span>
                          <p className="text-xs font-bold text-blueGray-700 text-center leading-tight max-w-20">
                            {badge.name}
                          </p>
                          {badge.description && (
                            <p className="text-xs text-blueGray-400 text-center leading-tight">
                              {badge.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message si aucun badge */}
                {!loadingXP && (!xpData?.badges || xpData.badges.length === 0) && (
                  <div className="mt-10 py-8 border-t border-blueGray-200 text-center">
                    <span className="text-4xl">🌱</span>
                    <p className="text-blueGray-400 text-sm mt-2">
                      Inscris-toi à une formation pour gagner tes premiers badges !
                    </p>
                  </div>
                )}

                {/* À propos */}
                {profile.about && (
                  <div className="py-10 border-t border-blueGray-200 text-center">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-9/12 px-4">
                        <h4 className="text-blueGray-500 text-sm font-bold uppercase mb-3">À propos</h4>
                        <p className="mb-4 text-lg leading-relaxed text-blueGray-700">{profile.about}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compétences */}
                {profile.skills?.length > 0 && (
                  <div className="py-10 border-t border-blueGray-200 text-center">
                    <h4 className="text-blueGray-500 text-sm font-bold uppercase mb-4">Compétences</h4>
                    <div className="flex flex-wrap justify-center gap-2 px-4">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center bg-lightBlue-100 text-lightBlue-700 text-xs font-semibold px-4 py-2 rounded-full border border-lightBlue-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}