import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function CardTableCentres({ color }) {
  const [centres, setCentres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState(null);

  // Fake data
  useEffect(() => {
    setCentres([
      {
        id: 1,
        name: "Centre IT",
        email: "it@centre.com",
        status: "pending",
        logo: "https://via.placeholder.com/80",
      },
      {
        id: 2,
        name: "Centre Design",
        email: "design@centre.com",
        status: "accepted",
        logo: "https://via.placeholder.com/80",
      },
    ]);
  }, []);

  const handleDelete = (id) => {
    setCentres(centres.filter((c) => c.id !== id));
  };

  const handleAccept = (id) => {
    setCentres(
      centres.map((c) =>
        c.id === id ? { ...c, status: "accepted" } : c
      )
    );
  };

  const handleSave = () => {
    setCentres(
      centres.map((c) =>
        c.id === selectedCentre.id ? selectedCentre : c
      )
    );
    setShowModal(false);
  };

  return (
    <>
      {/* TABLE */}
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light"
            ? "bg-white"
            : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <h3
            className={
              "font-semibold text-lg " +
              (color === "light"
                ? "text-blueGray-700"
                : "text-white")
            }
          >
            Gestion des Centres
          </h3>
        </div>

        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                {["Logo", "Nom", "Email", "Statut", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className={
                        "px-6 py-3 text-xs uppercase font-semibold text-left border-b " +
                        (color === "light"
                          ? "bg-blueGray-50 text-blueGray-500"
                          : "bg-lightBlue-800 text-lightBlue-300")
                      }
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {centres.map((centre) => (
                <tr key={centre.id}>
                  <td className="px-6 py-4">
                    <img
                      src={centre.logo}
                      alt="logo"
                      className="h-10 w-10 rounded-full border"
                    />
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {centre.name}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {centre.email}
                  </td>

                  <td className="px-6 py-4 text-sm font-bold">
                    <span
                      className={
                        centre.status === "accepted"
                          ? "text-emerald-500"
                          : "text-orange-500"
                      }
                    >
                      {centre.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 flex gap-2">
                    {centre.status === "pending" && (
                      <button
                        onClick={() =>
                          handleAccept(centre.id)
                        }
                        className="bg-emerald-500 text-white text-xs px-3 py-1 rounded"
                      >
                        Accepter
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedCentre(centre);
                        setShowModal(true);
                      }}
                      className="bg-lightBlue-500 text-white text-xs px-3 py-1 rounded"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(centre.id)
                      }
                      className="bg-red-500 text-white text-xs px-3 py-1 rounded"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedCentre && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-8">

              <h3 className="text-xl font-semibold mb-6">
                Modifier Centre
              </h3>

              {/* GRID FORM */}
              <div className="grid grid-cols-2 gap-6">

                {/* Logo */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1">
                    URL du logo
                  </label>

                  <input
                    type="text"
                    value={selectedCentre.logo}
                    onChange={(e) =>
                      setSelectedCentre({
                        ...selectedCentre,
                        logo: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />

                  <img
                    src={selectedCentre.logo}
                    alt="preview"
                    className="h-20 w-20 rounded-full border mt-3"
                  />
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Nom
                  </label>

                  <input
                    type="text"
                    value={selectedCentre.name}
                    onChange={(e) =>
                      setSelectedCentre({
                        ...selectedCentre,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Email
                  </label>

                  <input
                    type="email"
                    value={selectedCentre.email}
                    onChange={(e) =>
                      setSelectedCentre({
                        ...selectedCentre,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-blueGray-300 rounded"
                >
                  Annuler
                </button>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-lightBlue-500 text-white rounded"
                >
                  Enregistrer
                </button>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
}

CardTableCentres.defaultProps = {
  color: "light",
};

CardTableCentres.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
