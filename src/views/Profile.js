// import React from "react";

// import Navbar from "components/Navbars/AuthNavbar.js";
// import Footer from "components/Footers/Footer.js";

// export default function Profile() {
//   return (
//     <>
//       <Navbar transparent />
//       <main className="profile-page">
//         <section className="relative block h-500-px">
//           <div
//             className="absolute top-0 w-full h-full bg-center bg-cover"
//             style={{
//               backgroundImage:
//                 "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
//             }}
//           >
//             <span
//               id="blackOverlay"
//               className="w-full h-full absolute opacity-50 bg-black"
//             ></span>
//           </div>
//           <div
//             className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
//             style={{ transform: "translateZ(0)" }}
//           >
//             <svg
//               className="absolute bottom-0 overflow-hidden"
//               xmlns="http://www.w3.org/2000/svg"
//               preserveAspectRatio="none"
//               version="1.1"
//               viewBox="0 0 2560 100"
//               x="0"
//               y="0"
//             >
//               <polygon
//                 className="text-blueGray-200 fill-current"
//                 points="2560 0 2560 100 0 100"
//               ></polygon>
//             </svg>
//           </div>
//         </section>
//         <section className="relative py-16 bg-blueGray-200">
//           <div className="container mx-auto px-4">
//             <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
//               <div className="px-6">
//                 <div className="flex flex-wrap justify-center">
//                   <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
//                     <div className="relative">
//                       <img
//                         alt="..."
//                         src={require("assets/img/team-2-800x800.jpg").default}
//                         className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
//                       />
//                     </div>
//                   </div>
//                   <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
//                     <div className="py-6 px-3 mt-32 sm:mt-0">
//                       <button
//                         className="bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
//                         type="button"
//                       >
//                         Connect
//                       </button>
//                     </div>
//                   </div>
//                   <div className="w-full lg:w-4/12 px-4 lg:order-1">
//                     <div className="flex justify-center py-4 lg:pt-4 pt-8">
//                       <div className="mr-4 p-3 text-center">
//                         <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
//                           22
//                         </span>
//                         <span className="text-sm text-blueGray-400">
//                           Friends
//                         </span>
//                       </div>
//                       <div className="mr-4 p-3 text-center">
//                         <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
//                           10
//                         </span>
//                         <span className="text-sm text-blueGray-400">
//                           Photos
//                         </span>
//                       </div>
//                       <div className="lg:mr-4 p-3 text-center">
//                         <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
//                           89
//                         </span>
//                         <span className="text-sm text-blueGray-400">
//                           Comments
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-center mt-12">
//                   <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
//                     Jenna Stones
//                   </h3>
//                   <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
//                     <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{" "}
//                     Los Angeles, California
//                   </div>
//                   <div className="mb-2 text-blueGray-600 mt-10">
//                     <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
//                     Solution Manager - Creative Tim Officer
//                   </div>
//                   <div className="mb-2 text-blueGray-600">
//                     <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
//                     University of Computer Science
//                   </div>
//                 </div>
//                 <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
//                   <div className="flex flex-wrap justify-center">
//                     <div className="w-full lg:w-9/12 px-4">
//                       <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
//                         An artist of considerable range, Jenna the name taken by
//                         Melbourne-raised, Brooklyn-based Nick Murphy writes,
//                         performs and records all of his own music, giving it a
//                         warm, intimate feel with a solid groove structure. An
//                         artist of considerable range.
//                       </p>
//                       <a
//                         href="#pablo"
//                         className="font-normal text-lightBlue-500"
//                         onClick={(e) => e.preventDefault()}
//                       >
//                         Show more
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import StudentNavbar from "components/Navbars/StudentNavbar";
import Footer from "components/Footers/Footer.js";
import { Link } from "react-router-dom";

const DEFAULT_PROFILE = {
  username: "lucky.jesse",
  email: "jesse@example.com",
  firstName: "Lucky",
  lastName: "Jesse",
  city: "New York",
  country: "United States",
  about: "A beautiful UI Kit and Admin for React & Tailwind CSS. It is Free and Open Source.",
  skills: ["React.js", "Node.js"],
  avatar: null,
  badges: ["🏆 Top Learner", "💎 Premium", "⭐ Star Student"],
};

const STATS = {
  formationsFavoris: 5,
  xp: 1240,
  formationsParticipees: 3,
};

export default function Profile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    const saved = localStorage.getItem("studentProfile");
    if (saved) {
      setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(saved) });
    }
  }, []);

  // ─────────────────────────────────────────
  // Badge styles
  // ─────────────────────────────────────────
  const getBadgeStyle = (badgeName) => {
    const styles = {
      "🏆 Top Learner": "bg-amber-100 text-amber-700 border-amber-300",
      "🚀 Fast Starter": "bg-lightBlue-100 text-lightBlue-700 border-lightBlue-300",
      "⭐ Star Student": "bg-yellow-100 text-yellow-700 border-yellow-300",
      "🔥 Streak Master": "bg-orange-100 text-orange-700 border-orange-300",
      "💎 Premium": "bg-purple-100 text-purple-700 border-purple-300",
      "🎯 Goal Achiever": "bg-emerald-100 text-emerald-700 border-emerald-300",
      "📚 Bookworm": "bg-indigo-100 text-indigo-700 border-indigo-300",
      "🛡️ Certified": "bg-teal-100 text-teal-700 border-teal-300",
      "👑 Elite": "bg-red-100 text-red-700 border-red-300",
      "💡 Innovator": "bg-pink-100 text-pink-700 border-pink-300",
      "🤝 Team Player": "bg-cyan-100 text-cyan-700 border-cyan-300",
      "🏅 Champion": "bg-amber-100 text-amber-800 border-amber-400",
    };
    return styles[badgeName] || "bg-blueGray-100 text-blueGray-700 border-blueGray-300";
  };

  return (
    <>
      <StudentNavbar />
      <main className="profile-page">

        {/* ── Hero Banner ── */}
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&auto=format&fit=crop&w=2710&q=80')",
            }}
          >
            <span className="w-full h-full absolute opacity-50 bg-black"></span>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
            style={{ transform: "translateZ(0)" }}
          >
            <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none" viewBox="0 0 2560 100">
              <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100" />
            </svg>
          </div>
        </section>

        {/* ── Profile Card ── */}
        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">

                {/* Avatar + Stats + Actions */}
                <div className="flex flex-wrap justify-center">

                  {/* Avatar */}
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt="avatar"
                          className="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 object-cover"
                          style={{ width: "150px", height: "150px" }}
                        />
                      ) : (
                        <img
                          alt="avatar"
                          src={require("assets/img/team-2-800x800.jpg").default}
                          className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                        />
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {STATS.formationsFavoris}
                        </span>
                        <span className="text-sm text-blueGray-400">Favoris</span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {STATS.xp}
                        </span>
                        <span className="text-sm text-blueGray-400">XP</span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {STATS.formationsParticipees}
                        </span>
                        <span className="text-sm text-blueGray-400">Formations</span>
                      </div>
                      {/* Badge count */}
                      <div className="lg:mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {profile.badges ? profile.badges.length : 0}
                        </span>
                        <span className="text-sm text-blueGray-400">Badges</span>
                      </div>
                    </div>
                  </div>

                  {/* Edit button */}
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

                {/* ── Nom & Infos ── */}
                <div className="text-center mt-12">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-sm text-blueGray-500 mb-1">@{profile.username}</p>

                  {(profile.city || profile.country) && (
                    <div className="text-sm leading-normal mt-2 mb-2 text-blueGray-400 font-bold uppercase">
                      <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                      {profile.city}{profile.city && profile.country ? ", " : ""}{profile.country}
                    </div>
                  )}

                  {profile.email && (
                    <div className="mb-2 text-blueGray-600 mt-4">
                      <i className="fas fa-envelope mr-2 text-lg text-blueGray-400"></i>
                      {profile.email}
                    </div>
                  )}
                </div>

                {/* ══════════════════════════════════════
                    BADGES SECTION
                   ══════════════════════════════════════ */}
                {profile.badges && profile.badges.length > 0 && (
                  <div className="mt-10 py-8 border-t border-blueGray-200">
                    <div className="text-center mb-6">
                      <h4 className="text-blueGray-500 text-sm font-bold uppercase mb-1">
                        <i className="fas fa-award text-amber-500 mr-2"></i>
                        Mes Badges
                      </h4>
                      <p className="text-xs text-blueGray-400">
                        {profile.badges.length} badge{profile.badges.length > 1 ? "s" : ""} obtenu{profile.badges.length > 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Badges Grid */}
                    <div className="flex flex-wrap justify-center gap-3 px-4">
                      {profile.badges.map((badge, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 shadow-sm hover:shadow-md transition-all hover:scale-105 ${getBadgeStyle(badge)}`}
                        >
                          <span className="text-lg font-bold">{badge}</span>
                        </div>
                      ))}
                    </div>

                    {/* Badge Progress Bar */}
                    <div className="max-w-md mx-auto mt-6 px-4">
                      <div className="flex justify-between text-xs text-blueGray-400 mb-1">
                        <span>Progression badges</span>
                        <span>{profile.badges.length}/12</span>
                      </div>
                      <div className="w-full bg-blueGray-200 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(profile.badges.length / 12) * 100}%` }}
                        ></div>
                      </div>
                      {profile.badges.length < 12 && (
                        <p className="text-xs text-blueGray-400 mt-1 text-center">
                          Plus que {12 - profile.badges.length} badge{12 - profile.badges.length > 1 ? "s" : ""} pour compléter la collection !
                        </p>
                      )}
                      {profile.badges.length >= 12 && (
                        <p className="text-xs text-emerald-500 mt-1 text-center font-bold">
                          🎉 Collection complète ! Félicitations !
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* No Badges */}
                {(!profile.badges || profile.badges.length === 0) && (
                  <div className="mt-10 py-8 border-t border-blueGray-200 text-center">
                    <h4 className="text-blueGray-500 text-sm font-bold uppercase mb-3">
                      <i className="fas fa-award text-blueGray-300 mr-2"></i>
                      Mes Badges
                    </h4>
                    <div className="text-blueGray-300 mb-3">
                      <i className="fas fa-medal text-4xl"></i>
                    </div>
                    <p className="text-sm text-blueGray-400">
                      Aucun badge pour le moment.
                    </p>
                    <p className="text-xs text-blueGray-300 mt-1">
                      Continuez à apprendre pour débloquer vos premiers badges !
                    </p>
                  </div>
                )}

                {/* ── About ── */}
                {profile.about && (
                  <div className="py-10 border-t border-blueGray-200 text-center">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-9/12 px-4">
                        <h4 className="text-blueGray-500 text-sm font-bold uppercase mb-3">À propos</h4>
                        <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                          {profile.about}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Skills ── */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="py-10 border-t border-blueGray-200 text-center">
                    <h4 className="text-blueGray-500 text-sm font-bold uppercase mb-4">Compétences</h4>
                    <div className="flex flex-wrap justify-center gap-2 px-4">
                      {profile.skills.map((skill) => (
                        <span key={skill}
                          className="inline-flex items-center bg-lightBlue-100 text-lightBlue-700 text-xs font-semibold px-4 py-2 rounded-full border border-lightBlue-300">
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
    </>
  );
}