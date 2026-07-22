// src/views/admin/GestionDesEvaluations.js

import React, { useEffect, useState, useCallback } from "react";
import { getAllEvaluationsAdmin, deleteEvaluation } from "../../Services/ApiEvaluation";

function StarDisplay({ rating }) {
    return (
        <span className="text-amber-400 tracking-tight">
            {"★".repeat(rating)}
            <span className="text-blueGray-200">{"★".repeat(5 - rating)}</span>
        </span>
    );
}

export default function GestionDesEvaluations() {
    const [evaluations, setEvaluations] = useState([]);
    const [total,       setTotal]       = useState(0);
    const [loading,     setLoading]     = useState(true);
    const [page,        setPage]        = useState(1);
    const [filter,      setFilter]      = useState({ minRating: "", maxRating: "" });
    const LIMIT = 20;

    const load = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const params = { page: p, limit: LIMIT };
            if (filter.minRating) params.minRating = filter.minRating;
            if (filter.maxRating) params.maxRating = filter.maxRating;
            const res = await getAllEvaluationsAdmin(params);
            setEvaluations(res.data.evaluations || []);
            setTotal(res.data.total || 0);
            setPage(p);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => { load(1); }, [load]);

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cet avis ?")) return;
        try {
            await deleteEvaluation(id);
            load(page);
        } catch (e) {
            alert(e.response?.data?.error || "Erreur suppression");
        }
    };

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded-xl">

                    {/* Header */}
                    <div className="px-5 py-4 border-b border-blueGray-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-amber-400 text-xl">★</span>
                            <h3 className="font-semibold text-lg text-blueGray-700">
                                Gestion des Évaluations
                            </h3>
                            <span className="bg-blueGray-100 text-blueGray-500 text-xs font-bold px-2 py-0.5 rounded-full">
                                {total} avis
                            </span>
                        </div>

                        {/* Filtres */}
                        <div className="flex items-center gap-2">
                            <select value={filter.minRating}
                                onChange={e => setFilter(f => ({ ...f, minRating: e.target.value }))}
                                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-400">
                                <option value="">Note min</option>
                                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}★</option>)}
                            </select>
                            <select value={filter.maxRating}
                                onChange={e => setFilter(f => ({ ...f, maxRating: e.target.value }))}
                                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-400">
                                <option value="">Note max</option>
                                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}★</option>)}
                            </select>
                            <button onClick={() => setFilter({ minRating: "", maxRating: "" })}
                                className="text-sm text-blueGray-400 hover:text-red-400 px-2">
                                <i className="fas fa-times" /> Reset
                            </button>
                            <button onClick={() => load(1)}
                                className="bg-blueGray-100 text-blueGray-600 px-3 py-2 rounded-lg text-sm hover:bg-blueGray-200">
                                <i className="fas fa-sync-alt" />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <i className="fas fa-spinner fa-spin text-3xl text-lightBlue-400" />
                        </div>
                    ) : evaluations.length === 0 ? (
                        <div className="text-center py-16 text-blueGray-300">
                            <i className="fas fa-star text-4xl mb-3 block opacity-30" />
                            <p>Aucun avis trouvé</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-blueGray-50">
                                        {["Formation", "Étudiant", "Note", "Commentaire", "Date", "Action"].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-blueGray-400 text-xs uppercase font-semibold">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {evaluations.map((ev, i) => (
                                        <tr key={ev._id} className={`border-b transition-colors hover:bg-blueGray-50 ${i % 2 === 1 ? "bg-blueGray-50 bg-opacity-30" : ""}`}>
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-sm text-blueGray-700 max-w-40 truncate">
                                                    {ev.formationId?.name || "—"}
                                                </p>
                                                <p className="text-xs text-blueGray-400">{ev.formationId?.centre || ""}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-lightBlue-100 flex items-center justify-center font-bold text-lightBlue-700 text-xs flex-shrink-0">
                                                        {(ev.studentId?.name || "?").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-blueGray-700">{ev.studentId?.name || "—"}</p>
                                                        <p className="text-xs text-blueGray-400">{ev.studentId?.email || ""}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <StarDisplay rating={ev.rating} />
                                                <p className="text-xs text-blueGray-400">{ev.rating}/5</p>
                                            </td>
                                            <td className="px-4 py-3 max-w-xs">
                                                <p className="text-sm text-blueGray-600 truncate" title={ev.comment}>
                                                    {ev.comment || <span className="text-blueGray-300 italic">Aucun commentaire</span>}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <p className="text-xs text-blueGray-500">
                                                    {ev.createdAt ? new Date(ev.createdAt).toLocaleDateString("fr-FR") : "—"}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => handleDelete(ev._id)}
                                                    className="bg-red-100 text-red-600 hover:bg-red-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-all">
                                                    <i className="fas fa-trash-alt mr-1" /> Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-5 py-3 border-t flex items-center justify-between">
                            <span className="text-xs text-blueGray-400">
                                Page {page} / {totalPages} · {total} avis
                            </span>
                            <div className="flex gap-2">
                                <button disabled={page <= 1} onClick={() => load(page - 1)}
                                    className="px-3 py-1.5 text-sm rounded-lg border hover:bg-blueGray-50 disabled:opacity-30 transition-all">
                                    <i className="fas fa-chevron-left" />
                                </button>
                                <button disabled={page >= totalPages} onClick={() => load(page + 1)}
                                    className="px-3 py-1.5 text-sm rounded-lg border hover:bg-blueGray-50 disabled:opacity-30 transition-all">
                                    <i className="fas fa-chevron-right" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}