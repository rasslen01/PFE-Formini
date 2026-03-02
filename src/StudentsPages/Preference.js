// ═══════════════════════════════════════════════
// 📁 src/views/Preferences.js
// ═══════════════════════════════════════════════

import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function Preferences() {
  const history = useHistory();

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
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      history.push("/auth/login");
      return;
    }

    setUserName(user.name || "");

    try {
    
      const res = await
      console.log("TOKEN =", localStorage.getItem("token"));
      axios.get("http://localhost:5000/users/preferences", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // backend renvoie { preferences: {...} }
      if (res.data?.preferences) {
        setFormData(res.data.preferences);
      }
    } catch (err) {
      console.log("No previous preferences found");
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
      setIsSubmitting(true);
      setSubmitError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setSubmitError("Session expired. Please login again.");
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
      setSubmitError(error.response?.data?.error || "Error saving preferences");
    } finally {
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
  // UI
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-blueGray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        {submitError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {submitError}
          </div>
        )}

        {/* STEP 0 */}
        {currentStep === 0 && (
          <div className="text-center py-10">
            <h2 className="text-3xl font-bold mb-4">
              Welcome{userName ? `, ${userName}` : ""} 🎉
            </h2>
            <p className="mb-6 text-gray-500">
              Let's personalize your learning experience.
            </p>
            <button
              onClick={() => setCurrentStep(1)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg"
            >
              Get Started →
            </button>
          </div>
        )}

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Profile & Skills</h2>

            {/* Domaine */}
            <label className="block text-sm font-semibold mb-2">Domain</label>
            <select
              value={formData.domaine}
              onChange={(e) => handleChange("domaine", e.target.value)}
              className="border px-4 py-2 w-full mb-4 rounded"
            >
              <option value="">Select Domain</option>
              {domainesOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Objectif carrière */}
            <label className="block text-sm font-semibold mb-2">Career Objective</label>
            <select
              value={formData.objectifCarriere}
              onChange={(e) => handleChange("objectifCarriere", e.target.value)}
              className="border px-4 py-2 w-full mb-4 rounded"
            >
              <option value="">Select Objective</option>
              <option value="Emploi">Find a job</option>
              <option value="Freelance">Become freelance</option>
              <option value="Startup">Create a startup</option>
              <option value="Evolution">Career growth</option>
              <option value="Reconversion">Career change</option>
            </select>

            {/* Experience */}
            <label className="block text-sm font-semibold mb-2">Experience Level</label>
            <select
              value={formData.niveauExperience}
              onChange={(e) => handleChange("niveauExperience", e.target.value)}
              className="border px-4 py-2 w-full mb-4 rounded"
            >
              <option value="">Select Level</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
              <option value="Expert">Expert</option>
            </select>

            {/* Date naissance */}
            <label className="block text-sm font-semibold mb-2">Date of Birth</label>
            <input
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => handleChange("dateNaissance", e.target.value)}
              className="border px-4 py-2 w-full mb-4 rounded"
            />

            {/* Domaines d'intérêt */}
            <label className="block text-sm font-semibold mb-2">Interest Domains</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {domainesOptions.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.domaineInteret.includes(d)}
                    onChange={() => handleCheckbox("domaineInteret", d)}
                  />
                  {d}
                </label>
              ))}
            </div>

            {/* Skills by domain */}
            <label className="block text-sm font-semibold mb-2">Skills by Domain</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {competancesOptions.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.competanceParDomaine.includes(c)}
                    onChange={() => handleCheckbox("competanceParDomaine", c)}
                  />
                  {c}
                </label>
              ))}
            </div>

            {/* Skills to learn */}
            <label className="block text-sm font-semibold mb-2">Skills to Learn</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {competancesOptions.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm">
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
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Learning Preferences</h2>

            <label className="block text-sm font-semibold mb-2">Education Level</label>
            <select
              value={formData.niveauEtude}
              onChange={(e) => handleChange("niveauEtude", e.target.value)}
              className="border px-4 py-2 w-full mb-4 rounded"
            >
              <option value="">Select</option>
              <option value="Bac">Bac</option>
              <option value="Bac+2">Bac+2</option>
              <option value="Bac+3">Bac+3</option>
              <option value="Bac+5">Bac+5</option>
              <option value="Doctorat">Doctorat</option>
              <option value="Autodidacte">Autodidacte</option>
            </select>

            <label className="block text-sm font-semibold mb-2">Commitment Level</label>
            <select
              value={formData.niveauEngagement}
              onChange={(e) => handleChange("niveauEngagement", e.target.value)}
              className="border px-4 py-2 w-full mb-4 rounded"
            >
              <option value="">Select</option>
              <option value="Faible">Faible</option>
              <option value="Moyen">Moyen</option>
              <option value="Élevé">Élevé</option>
              <option value="Intensif">Intensif</option>
            </select>

            <label className="block text-sm font-semibold mb-2">Desired Difficulty</label>
            <select
              value={formData.niveauDifficulte}
              onChange={(e) => handleChange("niveauDifficulte", e.target.value)}
              className="border px-4 py-2 w-full mb-4 rounded"
            >
              <option value="">Select</option>
              <option value="Facile">Facile</option>
              <option value="Moyen">Moyen</option>
              <option value="Difficile">Difficile</option>
              <option value="Expert">Expert</option>
            </select>

            <label className="block text-sm font-semibold mb-2">Your Needs</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {besoinsOptions.map((b) => (
                <label key={b} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.besoin.includes(b)}
                    onChange={() => handleCheckbox("besoin", b)}
                  />
                  {b}
                </label>
              ))}
            </div>

            <label className="block text-sm font-semibold mb-2">Learning Style</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {stylesOptions.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm">
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
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Budget & Availability</h2>

            <label className="block text-sm font-semibold mb-2">Budget</label>
            <select
              value={formData.budget}
              onChange={(e) => handleChange("budget", e.target.value)}
              className="border px-4 py-2 w-full mb-4 rounded"
            >
              <option value="">Select</option>
              <option value="Gratuit">Gratuit</option>
              <option value="Moins de 50€">Moins de 50€</option>
              <option value="50-100€">50-100€</option>
              <option value="100-300€">100-300€</option>
              <option value="300€+">300€+</option>
              <option value="Illimité">Illimité</option>
            </select>

            <label className="block text-sm font-semibold mb-2">Current Status</label>
            <select
              value={formData.etat}
              onChange={(e) => handleChange("etat", e.target.value)}
              className="border px-4 py-2 w-full mb-4 rounded"
            >
              <option value="">Select</option>
              <option value="Étudiant">Étudiant</option>
              <option value="Employé">Employé</option>
              <option value="Freelance">Freelance</option>
              <option value="En recherche">En recherche</option>
              <option value="Entrepreneur">Entrepreneur</option>
              <option value="En reconversion">En reconversion</option>
            </select>

            <label className="block text-sm font-semibold mb-2">Available Days</label>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
              {joursOptions.map((j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() => handleCheckbox("disponibilite", j)}
                  className={`border rounded p-2 text-sm ${
                    formData.disponibilite.includes(j)
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                >
                  {j}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="bg-gray-300 px-6 py-2 rounded"
            >
              Previous
            </button>
          )}

          <div className="flex gap-3">
            <button onClick={handleSkip} className="text-gray-500">
              Skip
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-6 py-2 rounded"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-500 text-white px-6 py-2 rounded"
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