import React, { useState, useEffect } from "react";
import StudentNavbar from "components/Navbars/StudentNavbar";
import Footer from "components/Footers/Footer.js";
import { Link } from "react-router-dom";

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
  badges: [],
};

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const buildExtraKey = (userId) => `profile_extra_${userId}`;

export default function Profile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    const storedUser = safeParse(localStorage.getItem("user"));

    if (!storedUser?._id) {
      setProfile(DEFAULT_PROFILE);
      return;
    }

    const fullName = storedUser.name || "";
    const parts = fullName.trim().split(" ");
    const firstNameFromName = parts[0] || "";
    const lastNameFromName = parts.slice(1).join(" ") || "";

    const extraKey = buildExtraKey(storedUser._id);
    const extras = safeParse(localStorage.getItem(extraKey)) || {};

    const finalProfile = {
      username:
        extras.username ??
        storedUser.username ??
        storedUser.email?.split("@")[0] ??
        "",
      email: storedUser.email || "",
      firstName: extras.firstName ?? storedUser.firstName ?? firstNameFromName,
      lastName: extras.lastName ?? storedUser.lastName ?? lastNameFromName,
      city: extras.city ?? storedUser.city ?? "",
      country: extras.country ?? storedUser.country ?? "",
      about: extras.about ?? storedUser.about ?? "",
      skills: extras.skills ?? storedUser.skills ?? [],
      badges: storedUser.badges ?? [],
      avatar: extras.avatar
        ? extras.avatar
        : storedUser.user_Image
        ? storedUser.user_Image.startsWith("data:")
          ? storedUser.user_Image
          : `http://localhost:5000/uploads/${storedUser.user_Image}?t=${Date.now()}`
        : null,
    };

    setProfile(finalProfile);
  }, []);

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

  const fallbackAvatar = require("assets/img/team-2-800x800.jpg").default;
console.log("PROFILE DATA =", profile);
console.log("PROFILE AVATAR =", profile.avatar);
  return (
    <>
      <StudentNavbar />
      <main className="profile-page">
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
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 2560 100"
            >
              <polygon
                className="text-blueGray-200 fill-current"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </section>

        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
  <div className="relative -mt-20 z-20">
    <img
      src={profile.avatar || require("assets/img/team-2-800x800.jpg").default}
      alt="avatar"
      className="shadow-xl rounded-full object-cover border-4 border-white bg-white"
      style={{
        width: "150px",
        height: "150px",
      }}
      onError={(e) => {
        e.currentTarget.src = require("assets/img/team-2-800x800.jpg").default;
      }}
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
                          {profile.badges?.length || 0}
                        </span>
                        <span className="text-sm text-blueGray-400">Badges</span>
                      </div>
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

                <div className="text-center mt-12">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                    {profile.firstName} {profile.lastName}
                  </h3>

                  <p className="text-sm text-blueGray-500 mb-1">
                    @{profile.username}
                  </p>

                  {(profile.city || profile.country) && (
                    <div className="text-sm leading-normal mt-2 mb-2 text-blueGray-400 font-bold uppercase">
                      <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                      {profile.city}
                      {profile.city && profile.country ? ", " : ""}
                      {profile.country}
                    </div>
                  )}

                  {profile.email && (
                    <div className="mb-2 text-blueGray-600 mt-4">
                      <i className="fas fa-envelope mr-2 text-lg text-blueGray-400"></i>
                      {profile.email}
                    </div>
                  )}
                </div>

                {profile.badges && profile.badges.length > 0 && (
                  <div className="mt-10 py-8 border-t border-blueGray-200">
                    <div className="text-center mb-6">
                      <h4 className="text-blueGray-500 text-sm font-bold uppercase mb-1">
                        <i className="fas fa-award text-amber-500 mr-2"></i>
                        Mes Badges
                      </h4>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 px-4">
                      {profile.badges.map((badge, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 shadow-sm hover:shadow-md transition-all hover:scale-105 ${getBadgeStyle(
                            badge
                          )}`}
                        >
                          <span className="text-lg font-bold">{badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.about && (
                  <div className="py-10 border-t border-blueGray-200 text-center">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-9/12 px-4">
                        <h4 className="text-blueGray-500 text-sm font-bold uppercase mb-3">
                          À propos
                        </h4>
                        <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                          {profile.about}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {profile.skills && profile.skills.length > 0 && (
                  <div className="py-10 border-t border-blueGray-200 text-center">
                    <h4 className="text-blueGray-500 text-sm font-bold uppercase mb-4">
                      Compétences
                    </h4>
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
    </>
  );
}