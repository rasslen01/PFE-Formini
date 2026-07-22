// src/components/Cards/EvaluationSection.js
// Section complète : affichage des avis + formulaire de soumission

import React, { useEffect, useState } from "react";
import {
    getFormationEvaluations,
    getMyEvaluation,
    submitEvaluation,
    deleteEvaluation,
} from "../../Services/ApiEvaluation";

// ── Étoiles interactives ──────────────────────────────
function StarRating({ value, onChange, readonly = false, size = "text-2xl" }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => !readonly && onChange && onChange(star)}
                    onMouseEnter={() => !readonly && setHovered(star)}
                    onMouseLeave={() => !readonly && setHovered(0)}
                    className={`${size} transition-all ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
                >
                    <span style={{
                        color: star <= (hovered || value) ? "#f59e0b" : "#d1d5db",
                        textShadow: star <= (hovered || value) ? "0 0 6px rgba(245,158,11,0.3)" : "none",
                    }}>★</span>
                </button>
            ))}
        </div>
    );
}

// ── Barre de distribution ─────────────────────────────
function DistributionBar({ star, count, pct }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-blueGray-500 w-4 text-right">{star}</span>
            <span className="text-amber-400 text-xs">★</span>
            <div className="flex-1 h-2 bg-blueGray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-blueGray-400 w-6">{count}</span>
        </div>
    );
}

// ── Carte d'un avis ───────────────────────────────────
function EvaluationCard({ evaluation, currentUserId, onDelete }) {
    const { studentId, rating, comment, createdAt, _id } = evaluation;
    const isOwn = studentId?._id === currentUserId || studentId === currentUserId;

    return (
        <div className="bg-white rounded-xl border border-blueGray-100 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-lightBlue-100 flex items-center justify-center font-bold text-lightBlue-700 text-sm flex-shrink-0">
                        {(studentId?.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-blueGray-700">
                            {studentId?.name || "Étudiant"}
                            {isOwn && (
                                <span className="ml-2 text-xs bg-lightBlue-100 text-lightBlue-600 px-1.5 py-0.5 rounded-full font-normal">
                                    Vous
                                </span>
                            )}
                        </p>
                        <p className="text-xs text-blueGray-400">
                            {createdAt ? new Date(createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : ""}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <StarRating value={rating} readonly size="text-base" />
                    {isOwn && (
                        <button onClick={() => onDelete(_id)}
                            className="text-blueGray-300 hover:text-red-400 transition-colors ml-1"
                            title="Supprimer mon avis">
                            <i className="fas fa-trash-alt text-xs" />
                        </button>
                    )}
                </div>
            </div>
            {comment && (
                <p className="text-sm text-blueGray-600 leading-relaxed mt-2 pl-12">
                    {comment}
                </p>
            )}
        </div>
    );
}

// ── Composant principal ───────────────────────────────
export default function EvaluationSection({ formationId }) {
    const [data,        setData]        = useState({ evaluations: [], total: 0, avgRating: 0, distribution: [] });
    const [myEval,      setMyEval]      = useState(null);
    const [loading,     setLoading]     = useState(true);
    const [submitting,  setSubmitting]  = useState(false);
    const [showForm,    setShowForm]    = useState(false);

    // Formulaire
    const [rating,   setRating]   = useState(0);
    const [comment,  setComment]  = useState("");
    const [error,    setError]    = useState("");
    const [success,  setSuccess]  = useState("");

    const token     = localStorage.getItem("token");
    const user      = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();
    const userId    = user?._id;

    const load = async () => {
        setLoading(true);
        try {
            const [evalsRes, myRes] = await Promise.all([
                getFormationEvaluations(formationId),
                token ? getMyEvaluation(formationId).catch(() => ({ data: { evaluation: null } })) : Promise.resolve({ data: { evaluation: null } }),
            ]);
            setData(evalsRes.data);
            const my = myRes.data.evaluation;
            setMyEval(my);
            if (my) { setRating(my.rating); setComment(my.comment || ""); }
        } catch (e) {
            console.error("Erreur chargement évaluations:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (formationId) load(); }, [formationId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) { setError("Veuillez sélectionner une note."); return; }
        setSubmitting(true); setError(""); setSuccess("");
        try {
            await submitEvaluation(formationId, rating, comment);
            setSuccess(myEval ? "Avis modifié avec succès !" : "Avis publié avec succès !");
            setShowForm(false);
            await load();
        } catch (err) {
            setError(err.response?.data?.error || "Erreur lors de la soumission.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer votre avis ?")) return;
        try {
            await deleteEvaluation(id);
            setMyEval(null); setRating(0); setComment("");
            await load();
        } catch (err) {
            alert(err.response?.data?.error || "Erreur suppression.");
        }
    };

    return (
        <div className="mt-10">
            {/* ── Titre ──────────────────────────────── */}
            <h3 className="text-xl font-bold text-blueGray-800 mb-6 flex items-center gap-2">
                <span className="text-amber-400">★</span>
                Avis et évaluations
                {data.total > 0 && (
                    <span className="text-sm font-normal text-blueGray-400">({data.total} avis)</span>
                )}
            </h3>

            {/* ── Résumé global ──────────────────────── */}
            {data.total > 0 && (
                <div className="flex flex-wrap gap-6 bg-blueGray-50 rounded-2xl p-5 mb-6 border border-blueGray-100">
                    {/* Score global */}
                    <div className="flex flex-col items-center justify-center min-w-24">
                        <p className="text-5xl font-bold text-blueGray-800">{data.avgRating}</p>
                        <StarRating value={Math.round(data.avgRating)} readonly size="text-lg" />
                        <p className="text-xs text-blueGray-400 mt-1">{data.total} avis</p>
                    </div>
                    {/* Distribution */}
                    <div className="flex-1 min-w-48 flex flex-col gap-1.5 justify-center">
                        {(data.distribution || []).map(d => (
                            <DistributionBar key={d.star} {...d} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Bouton / formulaire ────────────────── */}
            {token && (
                <div className="mb-6">
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 bg-lightBlue-500 hover:bg-lightBlue-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
                        >
                            <i className={`fas ${myEval ? "fa-edit" : "fa-star"}`} />
                            {myEval ? "Modifier mon avis" : "Laisser un avis"}
                        </button>
                    ) : (
                        <form onSubmit={handleSubmit}
                            className="bg-white rounded-2xl border border-blueGray-200 p-5 shadow-sm">
                            <h4 className="font-bold text-blueGray-700 mb-4">
                                {myEval ? "Modifier votre avis" : "Votre évaluation"}
                            </h4>

                            {/* Note */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-blueGray-600 mb-2">
                                    Note <span className="text-red-400">*</span>
                                </label>
                                <StarRating value={rating} onChange={setRating} />
                                {rating > 0 && (
                                    <p className="text-xs text-blueGray-400 mt-1">
                                        {["", "Très mauvais", "Mauvais", "Correct", "Bien", "Excellent"][rating]}
                                    </p>
                                )}
                            </div>

                            {/* Commentaire */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-blueGray-600 mb-2">
                                    Commentaire <span className="text-blueGray-400 font-normal">(optionnel)</span>
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    maxLength={500}
                                    rows={3}
                                    placeholder="Partagez votre expérience avec cette formation..."
                                    className="w-full border border-blueGray-200 rounded-xl px-3 py-2.5 text-sm text-blueGray-700 focus:outline-none focus:ring-2 focus:ring-lightBlue-400 resize-none"
                                />
                                <p className="text-xs text-blueGray-400 text-right mt-1">{comment.length}/500</p>
                            </div>

                            {error   && <p className="text-red-500 text-sm mb-3"><i className="fas fa-exclamation-circle mr-1" />{error}</p>}
                            {success && <p className="text-emerald-600 text-sm mb-3"><i className="fas fa-check-circle mr-1" />{success}</p>}

                            <div className="flex gap-3">
                                <button type="submit" disabled={submitting || !rating}
                                    className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white font-bold text-sm px-5 py-2 rounded-xl transition-all disabled:opacity-50">
                                    {submitting ? <><i className="fas fa-spinner fa-spin mr-1" />Envoi...</> : "Publier"}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setError(""); }}
                                    className="bg-blueGray-100 text-blueGray-600 font-bold text-sm px-5 py-2 rounded-xl hover:bg-blueGray-200 transition-all">
                                    Annuler
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Message si non connecté */}
            {!token && (
                <div className="bg-blueGray-50 rounded-xl p-4 mb-6 text-center border border-blueGray-100">
                    <p className="text-blueGray-500 text-sm">
                        <a href="/auth/login" className="text-lightBlue-500 font-semibold hover:underline">
                            Connectez-vous
                        </a>{" "}
                        pour laisser un avis.
                    </p>
                </div>
            )}

            {/* ── Liste des avis ─────────────────────── */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <i className="fas fa-spinner fa-spin text-2xl text-lightBlue-400" />
                </div>
            ) : data.evaluations.length === 0 ? (
                <div className="text-center py-10 text-blueGray-300">
                    <i className="fas fa-star text-4xl mb-3 block opacity-30" />
                    <p className="text-sm">Aucun avis pour l'instant. Soyez le premier !</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {data.evaluations.map(ev => (
                        <EvaluationCard
                            key={ev._id}
                            evaluation={ev}
                            currentUserId={userId}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}