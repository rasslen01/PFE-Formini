import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import StudentNavbar from "components/Navbars/StudentNavbar";
import Footer from "components/Footers/Footer";
import TextType from "../views/TextType";
import {
  getMyInscriptions,
  acceptInscription,
  cancelInscription,
} from "../Services/apiInscriptions";

export default function MesInscriptions() {
  const history = useHistory();

  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");

  const loadInscriptions = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      history.push("/auth/login");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await getMyInscriptions(token);
      setInscriptions(res.data || []);
    } catch (err) {
      console.error("Load inscriptions error:", err);
      setError(
        err.response?.data?.error ||
          "Erreur lors du chargement des inscriptions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInscriptions();
  }, []);

  const handleAccept = async (id) => {
    const token = localStorage.getItem("token");

    try {
      setActionId(id);
      await acceptInscription(id, token);
      await loadInscriptions();
    } catch (err) {
      console.error("Accept inscription error:", err);
      alert(
        err.response?.data?.error || "Erreur lors de la confirmation."
      );
    } finally {
      setActionId("");
    }
  };

  const handleCancel = async (id) => {
    const token = localStorage.getItem("token");

    try {
      setActionId(id);
      await cancelInscription(id, token);
      await loadInscriptions();
    } catch (err) {
      console.error("Cancel inscription error:", err);
      alert(
        err.response?.data?.error || "Erreur lors de l'annulation."
      );
    } finally {
      setActionId("");
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";
    try {
      return new Date(dateValue).toLocaleDateString("fr-FR");
    } catch {
      return "—";
    }
  };

  const getStatusBadge = (status) => {
    if (status === "accepted") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">
          confirmé
        </span>
      );
    }

    if (status === "cancelled") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
          annulé
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-500">
        pending
      </span>
    );
  };

  return (
    <>
      <StudentNavbar />

      <main>
        <div className="relative pt-24 pb-32 flex content-center items-center justify-center min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1267&q=80')",
            }}
          >
            <span className="absolute w-full h-full bg-black opacity-75"></span>
          </div>

          <div className="container relative mx-auto px-4">
            <div className="flex flex-wrap justify-center text-center">
              <div className="w-full lg:w-7/12 px-4">
                <h1 className="text-white font-semibold text-5xl leading-tight">
                  <TextType
                    text={[
                      "Your story starts with us.",
                      "Inscris-toi aujourd'hui et dessine ton avenir.",
                    ]}
                    typingSpeed={75}
                    deletingSpeed={50}
                    pauseDuration={2000}
                    showCursor
                    cursorCharacter="_"
                  />
                </h1>

                <p className="mt-6 text-lg text-blueGray-200">
                  Chaque formation est une passerelle vers de nouvelles
                  opportunités. Rejoins-nous et construis ton avenir avec
                  confiance.
                </p>

                <Link
                  to="/landing"
                  className="inline-block mt-12 bg-lightBlue-500 text-white font-bold uppercase text-sm px-8 py-4 rounded-full shadow-lg hover:bg-lightBlue-600 hover:shadow-xl transition-all duration-150"
                >
                  Voir les formations
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none h-20">
            <svg
              className="absolute bottom-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 2560 100"
            >
              <polygon
                className="fill-current text-blueGray-200"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
      </main>

      <section className="relative bg-blueGray-100 py-16">
        <div className="container mx-auto px-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="bg-white shadow-lg rounded-lg overflow-x-auto max-h-[70vh] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blueGray-50">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-blueGray-500">
                    Formation
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-blueGray-500">
                    Centre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-blueGray-500">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-blueGray-500">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-blueGray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr className="border-t">
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-blueGray-500"
                    >
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Chargement...
                    </td>
                  </tr>
                ) : inscriptions.length === 0 ? (
                  <tr className="border-t">
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-blueGray-500"
                    >
                      Aucune inscription trouvée.
                    </td>
                  </tr>
                ) : (
                  inscriptions.map((item) => {
                    const formation = item.formationId || {};
                    const currentId = item._id;

                    return (
                      <tr key={currentId} className="border-t">
                        <td className="px-6 py-4 text-sm text-blueGray-700">
                          {formation.name || "—"}
                        </td>

                        <td className="px-6 py-4 text-sm text-blueGray-700">
                          {formation.centre || "—"}
                        </td>

                        <td className="px-6 py-4 text-sm text-blueGray-700">
                          {formatDate(formation.date)}
                        </td>

                        <td className="px-6 py-4 text-sm">
                          {getStatusBadge(item.status)}
                        </td>

                        <td className="px-6 py-4">
                          {item.status === "pending" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAccept(currentId)}
                                disabled={actionId === currentId}
                                className="bg-emerald-500 text-white text-xs px-4 py-2 rounded hover:bg-emerald-600 transition-all disabled:opacity-60"
                              >
                                {actionId === currentId ? "..." : "Confirmer"}
                              </button>

                              <button
                                onClick={() => handleCancel(currentId)}
                                disabled={actionId === currentId}
                                className="bg-red-500 text-white text-xs px-4 py-2 rounded hover:bg-red-600 transition-all disabled:opacity-60"
                              >
                                {actionId === currentId ? "..." : "Annuler"}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs italic text-blueGray-400">
                              Action terminée
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}