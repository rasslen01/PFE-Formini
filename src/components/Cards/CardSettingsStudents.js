import React, { useEffect, useRef, useState } from "react";
import { updateUser } from "Services/ApiUser";

// ======== Skills list ========
const SKILLS_LIST = [
  "React.js","React Native","Redux","Next.js","Vue.js","Angular",
  "JavaScript","TypeScript","HTML5","CSS3","Tailwind CSS","Bootstrap",
  "Node.js","Express.js","NestJS","GraphQL","REST API",
  "Python","Django","Flask","FastAPI",
  "Java","Spring Boot","PHP","Laravel",
  "MySQL","PostgreSQL","MongoDB","Firebase","Redis",
  "Docker","Kubernetes","AWS","Azure","Google Cloud",
  "Git","GitHub","GitLab","CI/CD","Linux",
  "Figma","Adobe XD","UI/UX Design","Photoshop",
  "Machine Learning","Deep Learning","TensorFlow","PyTorch",
  "Agile","Scrum","Jira","Project Management",
];

const safeParse = (v) => {
  try { return JSON.parse(v); } catch { return null; }
};

const buildExtraKey = (userId) => `profile_extra_${userId}`;

export default function CardSettingsStudents() {
  const fileInputRef = useRef(null);
  const saveTimerRef = useRef(null);
  const blurTimerRef = useRef(null);

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(null);

  // Password (UI only)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Skills UI
  const [skillInput, setSkillInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  // Profile editable
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    about: "",
    skills: [],
    avatar: null, // base64 (local)
  });

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (saveError) setSaveError("");
  };

  // ─────────────────────────────────────────
  // Cleanup timers (Fix unmounted warning)
  // ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    };
  }, []);

  // ─────────────────────────────────────────
  // Load user + load extra profile fields per user
  // ─────────────────────────────────────────
  useEffect(() => {
    const storedUser = safeParse(localStorage.getItem("user"));
    setUser(storedUser);

    if (!storedUser?._id) {
      setSaveError("Utilisateur introuvable. Reconnectez-vous.");
      return;
    }

    const fullName = storedUser.name || "";
    const parts = fullName.trim().split(" ");
    const firstNameFromName = parts[0] || "";
    const lastNameFromName = parts.slice(1).join(" ") || "";

    const firstName = storedUser.firstName || firstNameFromName;
    const lastName = storedUser.lastName || lastNameFromName;

    const extraKey = buildExtraKey(storedUser._id);
    const extras = safeParse(localStorage.getItem(extraKey)) || {};

    const initial = {
      username: extras.username ?? storedUser.username ?? storedUser.email?.split("@")[0] ?? "",
      email: storedUser.email ?? "",
      firstName: extras.firstName ?? firstName ?? "",
      lastName: extras.lastName ?? lastName ?? "",

      // optional fields
      address: extras.address ?? storedUser.address ?? "",
      city: extras.city ?? storedUser.city ?? "",
      country: extras.country ?? storedUser.country ?? "",
      postalCode: extras.postalCode ?? storedUser.postalCode ?? "",

      about: extras.about ?? storedUser.about ?? "",
      skills: extras.skills ?? storedUser.skills ?? [],

      avatar: extras.avatar ?? null, // local only
    };

    setProfile(initial);

    // avatar preview priority:
    // 1) extras.avatar (base64)
    // 2) backend user_Image file name
    if (extras.avatar) {
      setAvatarPreview(extras.avatar);
    } else if (storedUser.user_Image) {
      setAvatarPreview(
        storedUser.user_Image.startsWith("data:")
          ? storedUser.user_Image
          : `http://localhost:5000/uploads/${storedUser.user_Image}`
      );
    } else {
      setAvatarPreview(null);
    }
  }, []);

  // ── Avatar handler (local base64 only) ──
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 2 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setAvatarPreview(base64);
      handleChange("avatar", base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    handleChange("avatar", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─────────────────────────────────────────
  // Save profile (Option A)
  // backend: name + email only
  // local: rest per user
  // ─────────────────────────────────────────
  const handleSave = async () => {
    setSaveError("");
    setSaveSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setSaveError("Vous devez vous connecter (token manquant).");
      return;
    }
    if (!user?._id) {
      setSaveError("Utilisateur introuvable. Reconnectez-vous.");
      return;
    }

    setLoading(true);
    try {
      // Save extras locally
      const extraKey = buildExtraKey(user._id);
      localStorage.setItem(extraKey, JSON.stringify({
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        postalCode: profile.postalCode,
        about: profile.about,
        skills: profile.skills,
        avatar: profile.avatar,
      }));

      // Save minimal to backend
      const payloadBackend = {
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        email: profile.email,
      };

      const res = await updateUser(user._id, payloadBackend);

      // MUST use backend returned user (works in your Postman)
      const updatedUser = res?.data?.user ? res.data.user : { ...user, ...payloadBackend };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // success with cleanup timer
      setSaveSuccess(true);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSaveSuccess(false), 2500);

    } catch (err) {
      console.error("SAVE PROFILE ERROR:", err);
      setSaveError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de la sauvegarde."
      );
    } finally {
      setLoading(false);
    }
  };

  // Password strength (UI)
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

  const handlePasswordSave = async () => {
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

    setPasswordSuccess("OK (UI). Ajoute une route backend pour changer le mot de passe.");
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
    setSkillInput("");
    setSuggestions([]);
    setShowSuggestions(false);
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
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-blueGray-400 hover:text-blueGray-600 focus:outline-none"
      tabIndex={-1}
    >
      {show ? "🙈" : "👁️"}
    </button>
  );

  const fallbackAvatar = require("assets/img/team-2-800x800.jpg").default;
  const avatarSrc = avatarPreview || fallbackAvatar;

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between items-center">
          <h6 className="text-blueGray-700 text-xl font-bold">Mon compte</h6>

          <div className="flex items-center gap-3">
            {saveSuccess && <span className="text-green-500 text-xs font-semibold">✓ Sauvegardé !</span>}
            {saveError && <span className="text-red-500 text-xs font-semibold">{saveError}</span>}

            <button
              onClick={handleSave}
              disabled={loading}
              className={`bg-lightBlue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md transition-all ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              type="button"
            >
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>
          {/* Avatar */}
          <h6 className="text-blueGray-400 text-sm mt-6 mb-6 font-bold uppercase">Photo de profil</h6>
          <div className="flex flex-wrap px-4 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="rounded-full object-cover shadow-md border-4 border-white"
                  style={{ width: "96px", height: "96px" }}
                  onError={(e) => (e.currentTarget.src = fallbackAvatar)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-lightBlue-500 hover:bg-lightBlue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                >
                  📷
                </button>
              </div>

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
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border border-blueGray-300 text-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md block mb-2"
                >
                  Choisir une image
                </button>

                {(avatarPreview || profile.avatar) && (
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

          {/* Personal info */}
          <h6 className="text-blueGray-400 text-sm mt-6 mb-6 font-bold uppercase">Informations personnelles</h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Nom d'utilisateur</label>
              <input
                type="text"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                value={profile.username}
                onChange={(e) => handleChange("username", e.target.value)}
              />
            </div>

            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Email</label>
              <input
                type="email"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="w-full lg:w-6/12 px-4 mt-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Prénom</label>
              <input
                type="text"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                value={profile.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>

            <div className="w-full lg:w-6/12 px-4 mt-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Nom</label>
              <input
                type="text"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                value={profile.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* Contact */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Informations de contact</h6>
          <div className="flex flex-wrap">
            <div className="w-full px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Adresse</label>
              <input
                type="text"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                value={profile.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>

            <div className="w-full lg:w-4/12 px-4 mt-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Ville</label>
              <input
                type="text"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                value={profile.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>

            <div className="w-full lg:w-4/12 px-4 mt-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Pays</label>
              <input
                type="text"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                value={profile.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>

            <div className="w-full lg:w-4/12 px-4 mt-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Code Postal</label>
              <input
                type="text"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                value={profile.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
              />
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* About */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">À propos de moi</h6>
          <div className="w-full px-4">
            <textarea
              className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
              value={profile.about}
              onChange={(e) => handleChange("about", e.target.value)}
              rows="4"
            />
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* Skills */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Compétences</h6>
          <div className="w-full px-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 bg-lightBlue-100 text-lightBlue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-1 text-lightBlue-400 hover:text-red-500">×</button>
                </span>
              ))}
            </div>

            <div className="relative w-full mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={handleSkillInput}
                onKeyDown={handleSkillKeyDown}
                onBlur={() => {
                  if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
                  blurTimerRef.current = setTimeout(() => setShowSuggestions(false), 150);
                }}
                onFocus={() => skillInput && setShowSuggestions(true)}
                placeholder="Ajouter une compétence (ex: React, Python…)"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border border-blueGray-100 overflow-hidden">
                  {suggestions.map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={() => addSkill(s)}
                      className={"w-full text-left px-4 py-2 text-sm " + (i === activeSuggestion ? "bg-lightBlue-50 text-lightBlue-700 font-semibold" : "text-blueGray-600 hover:bg-blueGray-50")}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-blueGray-400 mt-1">↑↓ naviguer, Entrée sélectionner.</p>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* Password */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Changer le mot de passe</h6>
          {passwordError && <p className="text-red-500 text-sm px-4 mb-2">{passwordError}</p>}
          {passwordSuccess && <p className="text-green-500 text-sm px-4 mb-2">{passwordSuccess}</p>}

          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Ancien</label>
              <div className="relative">
                <input type={showOld ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                  className="border-0 px-3 py-3 pr-10 bg-white rounded text-sm shadow w-full" />
                <EyeIcon show={showOld} toggle={() => setShowOld(!showOld)} />
              </div>
            </div>

            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Nouveau</label>
              <div className="relative">
                <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="border-0 px-3 py-3 pr-10 bg-white rounded text-sm shadow w-full" />
                <EyeIcon show={showNew} toggle={() => setShowNew(!showNew)} />
              </div>

              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.level ? strength.color : "bg-blueGray-200"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-blueGray-400">Force : <span className="font-semibold">{strength.label}</span></p>
                </div>
              )}
            </div>

            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Confirmer</label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-0 px-3 py-3 pr-10 bg-white rounded text-sm shadow w-full" />
                <EyeIcon show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
              </div>
            </div>
          </div>

          <div className="flex justify-end px-4 mt-4">
            <button type="button" onClick={handlePasswordSave} disabled={loading}
              className="bg-blueGray-700 text-white font-bold uppercase text-xs px-6 py-2 rounded shadow hover:shadow-md">
              Mettre à jour le mot de passe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}