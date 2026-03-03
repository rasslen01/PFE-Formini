// ═══════════════════════════════════════════════
// 📁 src/views/Preferences.js
// ═══════════════════════════════════════════════

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import TextType from "views/TextType";
import axios from "axios";

export default function Preferences() {
  const history = useHistory();

  // Prevent state updates after unmount (fix memory leak warning)
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    domaine: "",
    objectifCarriere: "",
    domaineInteret: [],
    competanceParDomaine: [],
    competanceInteret: [],
    niveauExperience: "",
    dateNaissance: "",
    niveauEtude: "",
    niveauEngagement: "",
    besoin: [],
    niveauDifficulte: "",
    styleApprentissage: [],
    budget: "",
    etat: "",
    disponibilite: [],
  });

  // ─────────────────────────────────────────────
  // Steps UI
  // ─────────────────────────────────────────────
  const steps = [
    { title: "Welcome", subtitle: "Start your personalization" },
    { title: "Profile & Skills", subtitle: "Your background and interests" },
    { title: "Learning Style", subtitle: "How you like to learn" },
    { title: "Budget & Availability", subtitle: "Constraints and schedule" },
  ];

  const progressPercent = Math.round(
    (currentStep / (steps.length - 1)) * 100
  );

  // ─────────────────────────────────────────────
  // Options (comme ton ancien fichier)
  // ─────────────────────────────────────────────
  const domainesOptions = [
    "Développement Web",
    "Data Science",
    "Intelligence Artificielle",
    "Cybersécurité",
    "Design UX/UI",
    "Marketing Digital",
    "Cloud Computing",
    "Mobile Development",
  ];

  const competancesOptions = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "SQL",
    "Java",
    "PHP",
    "C++",
    "Machine Learning",
    "DevOps",
    "Docker",
    "Git",
  ];

  const besoinsOptions = [
    "Certification",
    "Reconversion professionnelle",
    "Montée en compétences",
    "Projet personnel",
    "Préparation entretien",
    "Freelancing",
  ];

  const stylesOptions = [
    "Vidéos",
    "Lecture",
    "Exercices pratiques",
    "Projets réels",
    "Quiz interactifs",
    "Mentorat",
    "Travail en groupe",
  ];

  const joursOptions = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  // ─────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckbox = (field, value) => {
    setFormData((prev) => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  const nextStep = () => setCurrentStep((s) => Math.min(3, s + 1));
  const prevStep = () => setCurrentStep((s) => Math.max(0, s - 1));

  // ─────────────────────────────────────────────
  // Load user + preferences from backend
  // ─────────────────────────────────────────────
  const loadPreferences = useCallback(async () => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const token = localStorage.getItem("token");

    if (!user || !token) {
      history.push("/auth/login");
      return;
    }

    if (isMountedRef.current) {
      setUserName(user.name || "");
    }

    // Load local draft first (if any)
    const draft = localStorage.getItem("preferencesDraft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (isMountedRef.current && parsed) {
          setFormData(parsed);
        }
      } catch (err) {
        console.error("Failed to parse draft preferences:", err);
      }
    }

    try {
      const res = await axios.get("http://localhost:5000/users/preferences", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!isMountedRef.current) return;

      // backend renvoie { preferences: {...} }
      if (res.data?.preferences) {
        setFormData(res.data.preferences);
      }
    } catch (err) {
      console.log(
        "No previous preferences found",
        err?.response?.data || err.message
      );
    }
  }, [history]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // ─────────────────────────────────────────────
  // Auto-save local draft (optionnel)
  // ─────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("preferencesDraft", JSON.stringify(formData));
  }, [formData]);

  // ─────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      if (isMountedRef.current) {
        setIsSubmitting(true);
        setSubmitError("");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        if (isMountedRef.current) {
          setSubmitError("Session expired. Please login again.");
          setIsSubmitting(false);
        }
        history.push("/auth/login");
        return;
      }

      await axios.put("http://localhost:5000/users/preferences", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Nettoyer session pour forcer login (comme tu veux)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("preferencesDraft");

      alert("✅ Preferences saved successfully!");
      history.push("/auth/login");
    } catch (error) {
      if (!isMountedRef.current) return;
      setSubmitError(error.response?.data?.error || "Error saving preferences");
    } finally {
      if (!isMountedRef.current) return;
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (window.confirm("Skip preferences?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("preferencesDraft");
      history.push("/auth/login");
    }
  };

  // ─────────────────────────────────────────────
  // Small UI helper classes
  // ─────────────────────────────────────────────
  const inputClass =
    "border border-blueGray-200 px-4 py-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-lightBlue-300";
  const selectClass =
    "border border-blueGray-200 px-4 py-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-lightBlue-300 bg-white";

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-blueGray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-blueGray-100">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-blueGray-800">
                Preferences Setup
              </h1>
              <p className="text-blueGray-500 mt-1">
                Answer a few questions so we can recommend the best trainings
                for you.
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold text-blueGray-600">
                {progressPercent}% completed
              </div>
              <div className="text-xs text-blueGray-400">
                Step {currentStep + 1} / {steps.length}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 w-full bg-blueGray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-lightBlue-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stepper */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((s, idx) => {
              const active = idx === currentStep;
              const done = idx < currentStep;

              return (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setCurrentStep(idx)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    active
                      ? "border-lightBlue-400 bg-lightBlue-50"
                      : done
                      ? "border-green-200 bg-green-50"
                      : "border-blueGray-200 bg-white hover:bg-blueGray-50"
                  }`}
                  title="Click to navigate steps"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        active
                          ? "bg-lightBlue-500 text-white"
                          : done
                          ? "bg-green-500 text-white"
                          : "bg-blueGray-200 text-blueGray-700"
                      }`}
                    >
                      {done ? "✓" : idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-blueGray-800 truncate">
                        {s.title}
                      </div>
                      <div className="text-xs text-blueGray-500 truncate">
                        {s.subtitle}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {submitError}
          </div>
        )}

        {/* STEP 0 - Welcome */}
        {currentStep === 0 && (
          <div className="rounded-2xl overflow-hidden border border-blueGray-100">
            <div className="bg-gradient-to-r from-lightBlue-500 to-indigo-500 p-8 text-white">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-black ">
  <TextType
    text={`Welcome${userName ? `, ${userName}` : ""} 👋`}
    speed={35}
  />
</h2>
                  <p className="mt-2 text-black/90 max-w-xl">
                    In 2 minutes, we’ll understand your goals and interests to
                    personalize your learning journey.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="bg-black /15 px-3 py-1 rounded-full text-sm">
                      🎯 Personalized recommendations
                    </span>
                    <span className="bg-black /15 px-3 py-1 rounded-full text-sm">
                      ⭐ Better matching trainings
                    </span>
                    <span className="bg-black /15 px-3 py-1 rounded-full text-sm">
                      ⏱️ Fast & simple
                    </span>
                  </div>
                </div>

                <div className="hidden md:block text-right">
                  <div className="text-sm text-white/80">Estimated time</div>
                  <div className="text-2xl font-extrabold">~2 min</div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-blueGray-50 border border-blueGray-100">
                  <div className="font-bold text-blueGray-800">1) Profile</div>
                  <div className="text-sm text-blueGray-500 mt-1">
                    Your domain, skills and experience.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-blueGray-50 border border-blueGray-100">
                  <div className="font-bold text-blueGray-800">2) Learning</div>
                  <div className="text-sm text-blueGray-500 mt-1">
                    Your preferred style & needs.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-blueGray-50 border border-blueGray-100">
                  <div className="font-bold text-blueGray-800">
                    3) Constraints
                  </div>
                  <div className="text-sm text-blueGray-500 mt-1">
                    Budget and availability.
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white px-6 py-3 rounded-xl font-bold transition"
                >
                  Start →
                </button>

                <button
                  onClick={handleSkip}
                  className="px-6 py-3 rounded-xl font-semibold border border-blueGray-200 text-blueGray-600 hover:bg-blueGray-50 transition"
                >
                  Skip for now
                </button>
              </div>

              <p className="text-xs text-blueGray-400 mt-4">
                You can update these preferences anytime from your profile /
                settings.
              </p>
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-extrabold mb-1 text-blueGray-800">
              Profile & Skills
            </h2>
            <p className="text-sm text-blueGray-500 mb-5">
              Tell us about your background so we can personalize content.
            </p>

            <label className="block text-sm font-semibold mb-2">Domain</label>
            <select
              value={formData.domaine}
              onChange={(e) => handleChange("domaine", e.target.value)}
              className={selectClass + " mb-4"}
            >
              <option value="">Select Domain</option>
              {domainesOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <label className="block text-sm font-semibold mb-2">
              Career Objective
            </label>
            <select
              value={formData.objectifCarriere}
              onChange={(e) => handleChange("objectifCarriere", e.target.value)}
              className={selectClass + " mb-4"}
            >
              <option value="">Select Objective</option>
              <option value="Emploi">Find a job</option>
              <option value="Freelance">Become freelance</option>
              <option value="Startup">Create a startup</option>
              <option value="Evolution">Career growth</option>
              <option value="Reconversion">Career change</option>
            </select>

            <label className="block text-sm font-semibold mb-2">
              Experience Level
            </label>
            <select
              value={formData.niveauExperience}
              onChange={(e) => handleChange("niveauExperience", e.target.value)}
              className={selectClass + " mb-4"}
            >
              <option value="">Select Level</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
              <option value="Expert">Expert</option>
            </select>

            <label className="block text-sm font-semibold mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => handleChange("dateNaissance", e.target.value)}
              className={inputClass + " mb-6"}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl border border-blueGray-100 bg-blueGray-50">
                <div className="font-bold text-blueGray-800 mb-3">
                  Interest Domains
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {domainesOptions.map((d) => (
                    <label
                      key={d}
                      className="flex items-center gap-2 text-sm text-blueGray-700"
                    >
                      <input
                        type="checkbox"
                        checked={formData.domaineInteret.includes(d)}
                        onChange={() => handleCheckbox("domaineInteret", d)}
                      />
                      {d}
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-blueGray-100 bg-blueGray-50">
                <div className="font-bold text-blueGray-800 mb-3">
                  Skills by Domain
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {competancesOptions.map((c) => (
                    <label
                      key={c}
                      className="flex items-center gap-2 text-sm text-blueGray-700"
                    >
                      <input
                        type="checkbox"
                        checked={formData.competanceParDomaine.includes(c)}
                        onChange={() =>
                          handleCheckbox("competanceParDomaine", c)
                        }
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-5 rounded-2xl border border-blueGray-100 bg-blueGray-50">
              <div className="font-bold text-blueGray-800 mb-3">
                Skills to Learn
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {competancesOptions.map((c) => (
                  <label
                    key={c}
                    className="flex items-center gap-2 text-sm text-blueGray-700"
                  >
                    <input
                      type="checkbox"
                      checked={formData.competanceInteret.includes(c)}
                      onChange={() => handleCheckbox("competanceInteret", c)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-extrabold mb-1 text-blueGray-800">
              Learning Preferences
            </h2>
            <p className="text-sm text-blueGray-500 mb-5">
              Choose what fits your learning style and your objectives.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Education Level
                </label>
                <select
                  value={formData.niveauEtude}
                  onChange={(e) => handleChange("niveauEtude", e.target.value)}
                  className={selectClass + " mb-4"}
                >
                  <option value="">Select</option>
                  <option value="Bac">Bac</option>
                  <option value="Bac+2">Bac+2</option>
                  <option value="Bac+3">Bac+3</option>
                  <option value="Bac+5">Bac+5</option>
                  <option value="Doctorat">Doctorat</option>
                  <option value="Autodidacte">Autodidacte</option>
                </select>

                <label className="block text-sm font-semibold mb-2">
                  Commitment Level
                </label>
                <select
                  value={formData.niveauEngagement}
                  onChange={(e) =>
                    handleChange("niveauEngagement", e.target.value)
                  }
                  className={selectClass + " mb-4"}
                >
                  <option value="">Select</option>
                  <option value="Faible">Faible</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Élevé">Élevé</option>
                  <option value="Intensif">Intensif</option>
                </select>

                <label className="block text-sm font-semibold mb-2">
                  Desired Difficulty
                </label>
                <select
                  value={formData.niveauDifficulte}
                  onChange={(e) =>
                    handleChange("niveauDifficulte", e.target.value)
                  }
                  className={selectClass}
                >
                  <option value="">Select</option>
                  <option value="Facile">Facile</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Difficile">Difficile</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="p-5 rounded-2xl border border-blueGray-100 bg-blueGray-50">
                <div className="font-bold text-blueGray-800 mb-3">Your Needs</div>
                <div className="grid grid-cols-2 gap-2">
                  {besoinsOptions.map((b) => (
                    <label
                      key={b}
                      className="flex items-center gap-2 text-sm text-blueGray-700"
                    >
                      <input
                        type="checkbox"
                        checked={formData.besoin.includes(b)}
                        onChange={() => handleCheckbox("besoin", b)}
                      />
                      {b}
                    </label>
                  ))}
                </div>

                <div className="font-bold text-blueGray-800 mt-6 mb-3">
                  Learning Style
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {stylesOptions.map((s) => (
                    <label
                      key={s}
                      className="flex items-center gap-2 text-sm text-blueGray-700"
                    >
                      <input
                        type="checkbox"
                        checked={formData.styleApprentissage.includes(s)}
                        onChange={() => handleCheckbox("styleApprentissage", s)}
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-extrabold mb-1 text-blueGray-800">
              Budget & Availability
            </h2>
            <p className="text-sm text-blueGray-500 mb-5">
              Tell us your constraints so we can recommend the best matching trainings.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Budget</label>
                <select
                  value={formData.budget}
                  onChange={(e) => handleChange("budget", e.target.value)}
                  className={selectClass + " mb-4"}
                >
                  <option value="">Select</option>
                  <option value="Gratuit">Gratuit</option>
                  <option value="Moins de 50€">Moins de 50€</option>
                  <option value="50-100€">50-100€</option>
                  <option value="100-300€">100-300€</option>
                  <option value="300€+">300€+</option>
                  <option value="Illimité">Illimité</option>
                </select>

                <label className="block text-sm font-semibold mb-2">
                  Current Status
                </label>
                <select
                  value={formData.etat}
                  onChange={(e) => handleChange("etat", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select</option>
                  <option value="Étudiant">Étudiant</option>
                  <option value="Employé">Employé</option>
                  <option value="Freelance">Freelance</option>
                  <option value="En recherche">En recherche</option>
                  <option value="Entrepreneur">Entrepreneur</option>
                  <option value="En reconversion">En reconversion</option>
                </select>
              </div>

              <div className="p-5 rounded-2xl border border-blueGray-100 bg-blueGray-50">
                <div className="font-bold text-blueGray-800 mb-3">
                  Available Days
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {joursOptions.map((j) => (
                    <button
                      key={j}
                      type="button"
                      onClick={() => handleCheckbox("disponibilite", j)}
                      className={`border rounded-xl p-2 text-sm transition ${
                        formData.disponibilite.includes(j)
                          ? "bg-lightBlue-500 border-lightBlue-500 text-white"
                          : "bg-white border-blueGray-200 text-blueGray-700 hover:bg-blueGray-100"
                      }`}
                    >
                      {j}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-10">
          <div>
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="px-6 py-2 rounded-xl bg-blueGray-100 text-blueGray-700 hover:bg-blueGray-200 transition font-semibold"
              >
                ← Previous
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-end">
            <button
              onClick={handleSkip}
              className="text-blueGray-500 hover:text-blueGray-700 font-semibold"
            >
              Skip
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white px-6 py-2 rounded-xl font-bold transition"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-xl font-bold transition text-white ${
                  isSubmitting
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isSubmitting ? "Saving..." : "Save Preferences"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}