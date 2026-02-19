import React, { useState, useRef } from "react";

const SKILLS_LIST = [
  "React.js", "React Native", "Redux", "Next.js", "Vue.js", "Angular",
  "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap",
  "Node.js", "Express.js", "NestJS", "GraphQL", "REST API",
  "Python", "Django", "Flask", "FastAPI",
  "Java", "Spring Boot", "PHP", "Laravel",
  "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Redis",
  "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud",
  "Git", "GitHub", "GitLab", "CI/CD", "Linux",
  "Figma", "Adobe XD", "UI/UX Design", "Photoshop",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
  "Agile", "Scrum", "Jira", "Project Management",
];

const DEFAULT_PROFILE = {
  username: "lucky.jesse",
  email: "jesse@example.com",
  firstName: "Lucky",
  lastName: "Jesse",
  address: "Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09",
  city: "New York",
  country: "United States",
  postalCode: "",
  about: "A beautiful UI Kit and Admin for React & Tailwind CSS. It is Free and Open Source.",
  skills: ["React.js", "Node.js"],
  avatar: null,
};

export default function CardSettingsStudents() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("studentProfile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar || null);
  const fileInputRef = useRef(null);

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Skills state
  const [skillInput, setSkillInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // ── Avatar handler ──
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 2 Mo.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      handleChange("avatar", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    handleChange("avatar", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    localStorage.setItem("studentProfile", JSON.stringify(profile));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: "Faible", color: "bg-red-400" };
    if (score === 2) return { level: 2, label: "Moyen", color: "bg-yellow-400" };
    if (score === 3) return { level: 3, label: "Bien", color: "bg-blue-400" };
    return { level: 4, label: "Fort", color: "bg-green-500" };
  };
  const strength = getPasswordStrength(newPassword);

  const handlePasswordSave = () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Veuillez remplir tous les champs.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return;
    }
    setPasswordSuccess("Mot de passe mis à jour avec succès !");
    setOldPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  // Skills handlers
  const handleSkillInput = (e) => {
    const val = e.target.value;
    setSkillInput(val);
    setActiveSuggestion(0);
    if (val.trim().length > 0) {
      const filtered = SKILLS_LIST.filter(
        (s) => s.toLowerCase().includes(val.toLowerCase()) && !profile.skills.includes(s)
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addSkill = (skill) => {
    if (!profile.skills.includes(skill)) handleChange("skills", [...profile.skills, skill]);
    setSkillInput(""); setSuggestions([]); setShowSuggestions(false);
  };

  const removeSkill = (skill) => {
    handleChange("skills", profile.skills.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "ArrowDown") setActiveSuggestion((p) => Math.min(p + 1, suggestions.length - 1));
    else if (e.key === "ArrowUp") setActiveSuggestion((p) => Math.max(p - 1, 0));
    else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions[activeSuggestion]) addSkill(suggestions[activeSuggestion]);
      else if (skillInput.trim()) addSkill(skillInput.trim());
    } else if (e.key === "Escape") setShowSuggestions(false);
  };

  const EyeIcon = ({ show, toggle }) => (
    <button type="button" onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-blueGray-400 hover:text-blueGray-600 focus:outline-none"
      tabIndex={-1}>
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between items-center">
            <h6 className="text-blueGray-700 text-xl font-bold">Mon compte</h6>
            <div className="flex items-center gap-3">
              {saveSuccess && (
                <span className="text-green-500 text-xs font-semibold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sauvegardé !
                </span>
              )}
              <button onClick={handleSave}
                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button">
                Sauvegarder
              </button>
            </div>
          </div>
        </div>

        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>

            {/* ── Photo de profil ── */}
            <h6 className="text-blueGray-400 text-sm mt-6 mb-6 font-bold uppercase">
              Photo de profil
            </h6>
            <div className="flex flex-wrap px-4 mb-6">
              <div className="flex items-center gap-6">
                {/* Preview */}
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="avatar preview"
                      className="rounded-full object-cover shadow-md border-4 border-white"
                      style={{ width: "96px", height: "96px" }}
                    />
                  ) : (
                    <img
                      src={require("assets/img/team-2-800x800.jpg").default}
                      alt="avatar default"
                      className="rounded-full object-cover shadow-md border-4 border-white"
                      style={{ width: "96px", height: "96px" }}
                    />
                  )}
                  {/* Camera overlay */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-lightBlue-500 hover:bg-lightBlue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>

                {/* Upload info */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-white border border-blueGray-300 text-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 block mb-2"
                  >
                    Choisir une image
                  </button>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="text-red-400 hover:text-red-600 text-xs font-semibold block"
                    >
                      🗑 Supprimer la photo
                    </button>
                  )}
                  <p className="text-xs text-blueGray-400 mt-1">JPG, PNG — Max 2 Mo</p>
                </div>
              </div>
            </div>

            <hr className="mt-2 border-b-1 border-blueGray-300" />

            {/* ── User Information ── */}
            <h6 className="text-blueGray-400 text-sm mt-6 mb-6 font-bold uppercase">
              Informations personnelles
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Nom d'utilisateur</label>
                  <input type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={profile.username} onChange={(e) => handleChange("username", e.target.value)} />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Email</label>
                  <input type="email"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={profile.email} onChange={(e) => handleChange("email", e.target.value)} />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Prénom</label>
                  <input type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={profile.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Nom</label>
                  <input type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={profile.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
                </div>
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            {/* ── Contact ── */}
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Informations de contact
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Adresse</label>
                  <input type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={profile.address} onChange={(e) => handleChange("address", e.target.value)} />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Ville</label>
                  <input type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={profile.city} onChange={(e) => handleChange("city", e.target.value)} />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Pays</label>
                  <input type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={profile.country} onChange={(e) => handleChange("country", e.target.value)} />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Code Postal</label>
                  <input type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={profile.postalCode} onChange={(e) => handleChange("postalCode", e.target.value)} />
                </div>
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            {/* ── About Me ── */}
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              À propos de moi
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Bio</label>
                  <textarea
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={profile.about} onChange={(e) => handleChange("about", e.target.value)} rows="4" />
                </div>
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            {/* ── Skills ── */}
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Compétences</h6>
            <div className="flex flex-wrap">
              <div className="w-full px-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.skills.map((skill) => (
                    <span key={skill}
                      className="inline-flex items-center gap-1 bg-lightBlue-100 text-lightBlue-700 text-xs font-semibold px-3 py-1 rounded-full border border-lightBlue-300">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}
                        className="ml-1 text-lightBlue-400 hover:text-red-500 focus:outline-none">×</button>
                    </span>
                  ))}
                </div>
                <div className="relative w-full mb-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blueGray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                    <input type="text" value={skillInput} onChange={handleSkillInput}
                      onKeyDown={handleSkillKeyDown}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      onFocus={() => skillInput && setShowSuggestions(true)}
                      placeholder="Ajouter une compétence (ex: React, Python…)"
                      className="border-0 pl-9 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                  </div>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border border-blueGray-100 overflow-hidden">
                      {suggestions.map((s, i) => (
                        <button key={s} type="button" onMouseDown={() => addSkill(s)}
                          className={"w-full text-left px-4 py-2 text-sm transition-colors duration-100 flex items-center gap-2 " +
                            (i === activeSuggestion ? "bg-lightBlue-50 text-lightBlue-700 font-semibold" : "text-blueGray-600 hover:bg-blueGray-50")}>
                          <span className="w-5 h-5 rounded-full bg-lightBlue-100 text-lightBlue-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {s.charAt(0)}
                          </span>
                          {s.toLowerCase().includes(skillInput.toLowerCase()) ? (
                            <>
                              {s.substring(0, s.toLowerCase().indexOf(skillInput.toLowerCase()))}
                              <strong className="text-lightBlue-600">
                                {s.substring(s.toLowerCase().indexOf(skillInput.toLowerCase()), s.toLowerCase().indexOf(skillInput.toLowerCase()) + skillInput.length)}
                              </strong>
                              {s.substring(s.toLowerCase().indexOf(skillInput.toLowerCase()) + skillInput.length)}
                            </>
                          ) : s}
                        </button>
                      ))}
                      {skillInput.trim() && !SKILLS_LIST.some(s => s.toLowerCase() === skillInput.toLowerCase()) && (
                        <button type="button" onMouseDown={() => addSkill(skillInput.trim())}
                          className="w-full text-left px-4 py-2 text-sm text-blueGray-500 hover:bg-blueGray-50 border-t border-blueGray-100 italic">
                          + Ajouter "{skillInput.trim()}"
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-blueGray-400 mt-1 px-1">
                  Tapez pour rechercher. Utilisez ↑↓ pour naviguer, Entrée pour sélectionner.
                </p>
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            {/* ── Change Password ── */}
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Changer le mot de passe
            </h6>

            {passwordError && (
              <div className="mx-4 mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="mx-4 mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2 text-green-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {passwordSuccess}
              </div>
            )}

            <div className="flex flex-wrap">
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Ancien mot de passe</label>
                  <div className="relative">
                    <input type={showOld ? "text" : "password"} value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)} placeholder="••••••••"
                      className="border-0 px-3 py-3 pr-10 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                    <EyeIcon show={showOld} toggle={() => setShowOld(!showOld)} />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Nouveau mot de passe</label>
                  <div className="relative">
                    <input type={showNew ? "text" : "password"} value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••"
                      className="border-0 px-3 py-3 pr-10 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                    <EyeIcon show={showNew} toggle={() => setShowNew(!showNew)} />
                  </div>
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-blueGray-200"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-blueGray-400">Force : <span className={`font-semibold ${strength.level === 1 ? "text-red-400" : strength.level === 2 ? "text-yellow-500" : strength.level === 3 ? "text-blue-500" : "text-green-500"}`}>{strength.label}</span></p>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Confirmer nouveau mot de passe</label>
                  <div className="relative">
                    <input type={showConfirm ? "text" : "password"} value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                      className={`border-0 px-3 py-3 pr-10 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${confirmPassword && newPassword !== confirmPassword ? "ring-2 ring-red-300" : confirmPassword && newPassword === confirmPassword ? "ring-2 ring-green-300" : ""}`} />
                    <EyeIcon show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-400 mt-1">Les mots de passe ne correspondent pas</p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-xs text-green-500 mt-1">✓ Les mots de passe correspondent</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end px-4 mt-2">
              <button type="button" onClick={handlePasswordSave}
                className="bg-blueGray-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-6 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150">
                Mettre à jour le mot de passe
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}