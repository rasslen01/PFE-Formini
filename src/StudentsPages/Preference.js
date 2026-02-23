// ═══════════════════════════════════════════════
// 📁 src/views/Preferences.js
// ═══════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function Preferences() {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState("");

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      history.push("/auth/register");
      return;
    }
    setUserName(user.name);
  }, [history]);

  // ─────────────────────────────────────────────
  // State global du formulaire
  // ─────────────────────────────────────────────
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
  // Options
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
    "JavaScript", "Python", "React", "Node.js",
    "SQL", "Java", "PHP", "C++",
    "Machine Learning", "DevOps", "Docker", "Git",
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
    "Vidéos", "Lecture", "Exercices pratiques", "Projets réels",
    "Quiz interactifs", "Mentorat", "Travail en groupe",
  ];

  const joursOptions = [
    "Lundi", "Mardi", "Mercredi", "Jeudi",
    "Vendredi", "Samedi", "Dimanche",
  ];

  // ─────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCheckbox = (field, value) => {
    const current = formData[field];
    if (current.includes(value)) {
      handleChange(field, current.filter((v) => v !== value));
    } else {
      handleChange(field, [...current, value]);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    localStorage.setItem("preferences", JSON.stringify(formData));
    localStorage.setItem("isNewUser", "false");

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user.isNewUser = false;
      user.preferencesCompleted = true;
      localStorage.setItem("user", JSON.stringify(user));
    }

    alert("✅ Preferences saved successfully!");
    history.push("/auth/login");
  };

  const handleSkip = () => {
    if (window.confirm("Skip preferences? You can complete them later.")) {
      localStorage.setItem("isNewUser", "false");
      history.push("/auth/login");
    }
  };

  // ─────────────────────────────────────────────
  // Steps config
  // ─────────────────────────────────────────────
  const steps = [
    { label: "Welcome", icon: "fas fa-home" },
    { label: "Profile", icon: "fas fa-user" },
    { label: "Learning", icon: "fas fa-book" },
    { label: "Availability", icon: "fas fa-calendar" },
  ];

  return (
    <div className="min-h-screen bg-blueGray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ══════════════════════════════════════
            STEPPER
           ══════════════════════════════════════ */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                    index < currentStep
                      ? "bg-emerald-500 text-white shadow-lg"
                      : index === currentStep
                      ? "bg-lightBlue-500 text-white shadow-lg"
                      : "bg-blueGray-200 text-blueGray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <i className={step.icon}></i>
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-semibold ${
                    index <= currentStep
                      ? "text-lightBlue-600"
                      : "text-blueGray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-3 rounded transition-all duration-500 ${
                    index < currentStep ? "bg-emerald-500" : "bg-blueGray-200"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ══════════════════════════════════════
            CONTENU
           ══════════════════════════════════════ */}
        <div className="bg-white rounded-lg shadow-xl p-8">

          {/* ════════════════════════════════
              ÉTAPE 0 : BIENVENUE
             ════════════════════════════════ */}
          {currentStep === 0 && (
            <div className="text-center py-10">
              <i className="fas fa-graduation-cap text-6xl text-lightBlue-500 mb-4 block"></i>

              <h2 className="text-3xl font-bold text-blueGray-800 mb-2">
                Welcome{userName ? `, ${userName}` : ""} ! 🎉
              </h2>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <i className="fas fa-check-circle text-emerald-500 text-xl mr-2"></i>
                <span className="text-emerald-700 font-semibold">
                  Account created successfully!
                </span>
              </div>

              <div className="max-w-2xl mx-auto">
                <p className="text-lg text-blueGray-500 mb-6 leading-relaxed">
                  We encourage you to fill each step of our form with{" "}
                  <span className="font-semibold text-lightBlue-600">
                    care and precision
                  </span>
                  . Your answers will help us personalize your learning
                  experience and recommend the best courses for your profile.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-8">
                  <div className="bg-lightBlue-50 rounded-lg p-4">
                    <i className="fas fa-user-edit text-2xl text-lightBlue-500 mb-2 block"></i>
                    <h4 className="font-bold text-blueGray-700 text-sm">
                      Step 1
                    </h4>
                    <p className="text-xs text-blueGray-400">
                      Profile & Skills
                    </p>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-4">
                    <i className="fas fa-book-reader text-2xl text-emerald-500 mb-2 block"></i>
                    <h4 className="font-bold text-blueGray-700 text-sm">
                      Step 2
                    </h4>
                    <p className="text-xs text-blueGray-400">
                      Learning Style
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4">
                    <i className="fas fa-calendar-check text-2xl text-amber-500 mb-2 block"></i>
                    <h4 className="font-bold text-blueGray-700 text-sm">
                      Step 3
                    </h4>
                    <p className="text-xs text-blueGray-400">
                      Budget & Availability
                    </p>
                  </div>
                </div>

                <p className="text-sm text-blueGray-400 italic">
                  <i className="fas fa-clock mr-1"></i>
                  Estimated time: 5 minutes
                </p>
              </div>
            </div>
          )}

          {/* ════════════════════════════════
              ÉTAPE 1 : PROFIL & COMPÉTENCES
             ════════════════════════════════ */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-blueGray-800 mb-2">
                <i className="fas fa-user text-lightBlue-500 mr-2"></i>
                Profile & Skills
              </h2>
              <p className="text-blueGray-400 mb-6 text-sm">
                Tell us about your background and skills
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Domaine */}
                <div>
                  <label className="block text-blueGray-600 text-sm font-bold mb-2">
                    <i className="fas fa-laptop-code mr-1 text-lightBlue-400"></i>
                    Domain
                  </label>
                  <select
                    value={formData.domaine}
                    onChange={(e) => handleChange("domaine", e.target.value)}
                    className="border rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
                  >
                    <option value="">-- Select --</option>
                    {domainesOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Objectif */}
                <div>
                  <label className="block text-blueGray-600 text-sm font-bold mb-2">
                    <i className="fas fa-bullseye mr-1 text-red-400"></i>
                    Career Objective
                  </label>
                  <select
                    value={formData.objectifCarriere}
                    onChange={(e) => handleChange("objectifCarriere", e.target.value)}
                    className="border rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
                  >
                    <option value="">-- Select --</option>
                    <option value="Emploi">Find a job</option>
                    <option value="Freelance">Become freelance</option>
                    <option value="Startup">Create a startup</option>
                    <option value="Evolution">Career growth</option>
                    <option value="Reconversion">Career change</option>
                  </select>
                </div>

                {/* Date de naissance */}
                <div>
                  <label className="block text-blueGray-600 text-sm font-bold mb-2">
                    <i className="fas fa-birthday-cake mr-1 text-pink-400"></i>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => handleChange("dateNaissance", e.target.value)}
                    className="border rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
                  />
                </div>

                {/* Niveau expérience */}
                <div>
                  <label className="block text-blueGray-600 text-sm font-bold mb-2">
                    <i className="fas fa-chart-line mr-1 text-emerald-400"></i>
                    Experience Level
                  </label>
                  <select
                    value={formData.niveauExperience}
                    onChange={(e) => handleChange("niveauExperience", e.target.value)}
                    className="border rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
                  >
                    <option value="">-- Select --</option>
                    <option value="Débutant">🌱 Beginner</option>
                    <option value="Intermédiaire">📈 Intermediate</option>
                    <option value="Avancé">🚀 Advanced</option>
                    <option value="Expert">🏆 Expert</option>
                  </select>
                </div>

                {/* Domaines d'intérêt */}
                <div className="md:col-span-2">
                  <label className="block text-blueGray-600 text-sm font-bold mb-3">
                    <i className="fas fa-heart mr-1 text-red-400"></i>
                    Interest Domains
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {domainesOptions.map((d) => (
                      <label
                        key={d}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                          formData.domaineInteret.includes(d)
                            ? "bg-lightBlue-50 border-lightBlue-500 text-lightBlue-700"
                            : "bg-white border-blueGray-200 hover:bg-blueGray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.domaineInteret.includes(d)}
                          onChange={() => handleCheckbox("domaineInteret", d)}
                          className="form-checkbox text-lightBlue-500"
                        />
                        {d}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Compétences par domaine */}
                <div className="md:col-span-2">
                  <label className="block text-blueGray-600 text-sm font-bold mb-3">
                    <i className="fas fa-tools mr-1 text-amber-400"></i>
                    Skills by Domain
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {competancesOptions.map((c) => (
                      <label
                        key={c}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                          formData.competanceParDomaine.includes(c)
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                            : "bg-white border-blueGray-200 hover:bg-blueGray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.competanceParDomaine.includes(c)}
                          onChange={() => handleCheckbox("competanceParDomaine", c)}
                          className="form-checkbox text-emerald-500"
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Compétences d'intérêt */}
                <div className="md:col-span-2">
                  <label className="block text-blueGray-600 text-sm font-bold mb-3">
                    <i className="fas fa-star mr-1 text-yellow-400"></i>
                    Skills to Learn
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {competancesOptions.map((c) => (
                      <label
                        key={c}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                          formData.competanceInteret.includes(c)
                            ? "bg-amber-50 border-amber-500 text-amber-700"
                            : "bg-white border-blueGray-200 hover:bg-blueGray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.competanceInteret.includes(c)}
                          onChange={() => handleCheckbox("competanceInteret", c)}
                          className="form-checkbox text-amber-500"
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ════════════════════════════════
              ÉTAPE 2 : APPRENTISSAGE
             ════════════════════════════════ */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-blueGray-800 mb-2">
                <i className="fas fa-book text-emerald-500 mr-2"></i>
                Learning Style
              </h2>
              <p className="text-blueGray-400 mb-6 text-sm">
                Help us adapt your learning path
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Niveau d'étude */}
                <div>
                  <label className="block text-blueGray-600 text-sm font-bold mb-2">
                    <i className="fas fa-graduation-cap mr-1 text-lightBlue-400"></i>
                    Education Level
                  </label>
                  <select
                    value={formData.niveauEtude}
                    onChange={(e) => handleChange("niveauEtude", e.target.value)}
                    className="border rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
                  >
                    <option value="">-- Select --</option>
                    <option value="Bac">🎓 High School</option>
                    <option value="Bac+2">📚 Associate Degree</option>
                    <option value="Bac+3">📖 Bachelor's</option>
                    <option value="Bac+5">🎯 Master's</option>
                    <option value="Doctorat">🏅 PhD</option>
                    <option value="Autodidacte">💡 Self-taught</option>
                  </select>
                </div>

                {/* Niveau engagement */}
                <div>
                  <label className="block text-blueGray-600 text-sm font-bold mb-2">
                    <i className="fas fa-fire mr-1 text-orange-400"></i>
                    Commitment Level
                  </label>
                  <select
                    value={formData.niveauEngagement}
                    onChange={(e) => handleChange("niveauEngagement", e.target.value)}
                    className="border rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
                  >
                    <option value="">-- Select --</option>
                    <option value="Faible">🐢 Low (1-2h/week)</option>
                    <option value="Moyen">🚶 Medium (3-5h/week)</option>
                    <option value="Élevé">🏃 High (6-10h/week)</option>
                    <option value="Intensif">🚀 Intensive (10h+/week)</option>
                  </select>
                </div>

                {/* Niveau difficulté */}
                <div className="md:col-span-2">
                  <label className="block text-blueGray-600 text-sm font-bold mb-3">
                    <i className="fas fa-signal mr-1 text-purple-400"></i>
                    Desired Difficulty
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: "Facile", emoji: "🟢", label: "Easy", bg: "bg-emerald-50", border: "border-emerald-500", text: "text-emerald-700" },
                      { value: "Moyen", emoji: "🟡", label: "Medium", bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-700" },
                      { value: "Difficile", emoji: "🟠", label: "Hard", bg: "bg-orange-50", border: "border-orange-500", text: "text-orange-700" },
                      { value: "Expert", emoji: "🔴", label: "Expert", bg: "bg-red-50", border: "border-red-500", text: "text-red-700" },
                    ].map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => handleChange("niveauDifficulte", level.value)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                          formData.niveauDifficulte === level.value
                            ? `${level.bg} ${level.border} ${level.text} shadow-md scale-105`
                            : "bg-white border-blueGray-200 text-blueGray-500 hover:bg-blueGray-50"
                        }`}
                      >
                        <span className="text-xl">{level.emoji}</span>
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Besoins */}
                <div className="md:col-span-2">
                  <label className="block text-blueGray-600 text-sm font-bold mb-3">
                    <i className="fas fa-clipboard-list mr-1 text-indigo-400"></i>
                    Your Needs
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {besoinsOptions.map((b) => (
                      <label
                        key={b}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                          formData.besoin.includes(b)
                            ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                            : "bg-white border-blueGray-200 hover:bg-blueGray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.besoin.includes(b)}
                          onChange={() => handleCheckbox("besoin", b)}
                          className="form-checkbox text-indigo-500"
                        />
                        {b}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Style d'apprentissage */}
                <div className="md:col-span-2">
                  <label className="block text-blueGray-600 text-sm font-bold mb-3">
                    <i className="fas fa-palette mr-1 text-pink-400"></i>
                    Learning Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {stylesOptions.map((s) => (
                      <label
                        key={s}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                          formData.styleApprentissage.includes(s)
                            ? "bg-pink-50 border-pink-500 text-pink-700"
                            : "bg-white border-blueGray-200 hover:bg-blueGray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.styleApprentissage.includes(s)}
                          onChange={() => handleCheckbox("styleApprentissage", s)}
                          className="form-checkbox text-pink-500"
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ════════════════════════════════
              ÉTAPE 3 : BUDGET & DISPONIBILITÉ
             ════════════════════════════════ */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-blueGray-800 mb-2">
                <i className="fas fa-calendar-alt text-amber-500 mr-2"></i>
                Budget & Availability
              </h2>
              <p className="text-blueGray-400 mb-6 text-sm">
                Last step! Set your budget and availability
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Budget */}
                <div>
                  <label className="block text-blueGray-600 text-sm font-bold mb-2">
                    <i className="fas fa-wallet mr-1 text-emerald-400"></i>
                    Your Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => handleChange("budget", e.target.value)}
                    className="border rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
                  >
                    <option value="">-- Select --</option>
                    <option value="Gratuit">🆓 Free only</option>
                    <option value="Moins de 50€">💰 Less than 50DT</option>
                    <option value="50-100€">💳 50DT - 100DT</option>
                    <option value="100-300€">💎 100DT - 300DT</option>
                    <option value="300€+">🏆 More than 300DT</option>
                    <option value="Illimité">♾️ No limit</option>
                  </select>
                </div>

                {/* État */}
                <div>
                  <label className="block text-blueGray-600 text-sm font-bold mb-2">
                    <i className="fas fa-briefcase mr-1 text-lightBlue-400"></i>
                    Current Status
                  </label>
                  <select
                    value={formData.etat}
                    onChange={(e) => handleChange("etat", e.target.value)}
                    className="border rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
                  >
                    <option value="">-- Select --</option>
                    <option value="Étudiant">🎓 Student</option>
                    <option value="Employé">💼 Employed</option>
                    <option value="Freelance">🏠 Freelance</option>
                    <option value="En recherche">🔍 Job seeking</option>
                    <option value="Entrepreneur">🚀 Entrepreneur</option>
                    <option value="En reconversion">🔄 Career change</option>
                  </select>
                </div>

                {/* Disponibilité */}
                <div className="md:col-span-2">
                  <label className="block text-blueGray-600 text-sm font-bold mb-3">
                    <i className="fas fa-calendar-check mr-1 text-amber-400"></i>
                    Available Days
                  </label>
                  <p className="text-xs text-blueGray-400 mb-4">
                    Check the days you're available to learn
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
                    {joursOptions.map((jour) => (
                      <button
                        key={jour}
                        type="button"
                        onClick={() => handleCheckbox("disponibilite", jour)}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                          formData.disponibilite.includes(jour)
                            ? "bg-lightBlue-500 border-lightBlue-600 text-white shadow-lg scale-105"
                            : "bg-white border-blueGray-200 text-blueGray-500 hover:bg-blueGray-50 hover:border-blueGray-300"
                        }`}
                      >
                        <div className="text-2xl mb-1">
                          {formData.disponibilite.includes(jour) ? "✅" : "📅"}
                        </div>
                        <div className="text-sm font-bold">{jour}</div>
                      </button>
                    ))}
                  </div>

                  {formData.disponibilite.length > 0 && (
                    <div className="mt-4 p-3 bg-lightBlue-50 rounded-lg">
                      <p className="text-sm text-lightBlue-700">
                        <i className="fas fa-info-circle mr-1"></i>
                        <strong>{formData.disponibilite.length}</strong> day(s)
                        selected: {formData.disponibilite.join(", ")}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              NAVIGATION BUTTONS
             ══════════════════════════════════════ */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t">
            <div>
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 bg-blueGray-200 text-blueGray-700 px-6 py-3 rounded-lg font-bold text-sm hover:bg-blueGray-300 transition-all"
                >
                  <i className="fas fa-arrow-left"></i>
                  Previous
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSkip}
                className="flex items-center gap-2 text-blueGray-400 px-4 py-3 rounded-lg text-sm hover:text-blueGray-600 transition-all"
              >
                Skip
                <i className="fas fa-forward"></i>
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-lightBlue-500 text-white px-8 py-3 rounded-lg font-bold text-sm hover:bg-lightBlue-600 shadow-lg hover:shadow-xl transition-all"
                >
                  {currentStep === 0 ? "Get Started" : "Next"}
                  <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold text-sm hover:bg-emerald-600 shadow-lg hover:shadow-xl transition-all"
                >
                  <i className="fas fa-check-circle"></i>
                  Save Preferences
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-blueGray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round((currentStep / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-blueGray-200 rounded-full h-2">
              <div
                className="bg-lightBlue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}