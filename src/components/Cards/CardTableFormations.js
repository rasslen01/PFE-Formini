// src/components/Tables/CardTableFormations.js
import React, { useEffect, useState } from "react";
import TableDropdown from "components/Dropdowns/TableDropdown";

export default function CardTableFormations({ color }) {
  const [formations, setFormations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);

  // Fake data
  useEffect(() => {
    setFormations([
      {
        id: 1,
        name: "React Avancé",
        instructor: "Ali Ben Salah",
        centre: "Centre IT",
        location: "Tunis",
        price: 200,
        date: "2026-02-20",
        time: "10:00",
      },
      {
        id: 2,
        name: "UI/UX Design",
        instructor: "Sara Trabelsi",
        centre: "Design Lab",
        location: "Sfax",
        price: 0,
        date: "2026-03-05",
        time: "14:00",
      },
    ]);
  }, []);

  // Bloquer scroll du body quand modal ouverte
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);

  const handleDelete = (id) => {
    setFormations(formations.filter((f) => f.id !== id));
  };

  const handleSave = () => {
    setFormations(
      formations.map((f) =>
        f.id === selectedFormation.id ? selectedFormation : f
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
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <h3
            className={
              "font-semibold text-lg " +
              (color === "light" ? "text-blueGray-700" : "text-white")
            }
          >
            Gestion des Formations
          </h3>
        </div>

        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                {[
                  "Nom",
                  "Formateur",
                  "Centre",
                  "Lieu",
                  "Prix",
                  "Date",
                  "Heure",
                  "Actions",
                ].map((h) => (
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
                ))}
              </tr>
            </thead>

            <tbody>
              {formations.map((f) => (
                <tr key={f.id}>
                  <td className="px-6 py-4 text-sm">{f.name}</td>
                  <td className="px-6 py-4 text-sm">{f.instructor}</td>
                  <td className="px-6 py-4 text-sm">{f.centre}</td>
                  <td className="px-6 py-4 text-sm">{f.location}</td>
                  <td className="px-6 py-4 text-sm">
                    {f.price === 0 ? "Gratuit" : `${f.price} DH`}
                  </td>
                  <td className="px-6 py-4 text-sm">{f.date}</td>
                  <td className="px-6 py-4 text-sm">{f.time}</td>
                  <td className="px-6 py-4 text-sm">
                    <TableDropdown
                      onAccept={() => alert("Accepted")}
                      onDelete={() => handleDelete(f.id)}
                    />
                    <button
                      onClick={() => {
                        setSelectedFormation(f);
                        setShowModal(true);
                      }}
                      className="ml-2 px-2 py-1 bg-lightBlue-500 text-white text-xs rounded"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {/* Modal */}
{showModal && selectedFormation && (
  <>
    <div className="modal-backdrop"></div>
    <div className="modal-container">
      <h3 className="text-xl font-semibold mb-4">Modifier Formation</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Nom */}
          <input
            type="text"
            placeholder="Nom de formation"
            value={selectedFormation.name}
            onChange={(e) =>
              setSelectedFormation({
                ...selectedFormation,
                name: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full"
          />

          {/* Prix */}
          <input
            type="number"
            placeholder="Prix"
            value={selectedFormation.price}
            onChange={(e) =>
              setSelectedFormation({
                ...selectedFormation,
                price: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full"
          />

          {/* Formateur */}
          <input
            type="text"
            placeholder="Formateur"
            value={selectedFormation.instructor}
            onChange={(e) =>
              setSelectedFormation({
                ...selectedFormation,
                instructor: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full"
          />

          {/* Localisation */}
          <input
            type="text"
            placeholder="Localisation"
            value={selectedFormation.location}
            onChange={(e) =>
              setSelectedFormation({
                ...selectedFormation,
                location: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full"
          />

          {/* Date */}
          <input
            type="date"
            value={selectedFormation.date}
            onChange={(e) =>
              setSelectedFormation({
                ...selectedFormation,
                date: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full"
          />

          {/* Heure */}
          <input
            type="time"
            value={selectedFormation.time}
            onChange={(e) =>
              setSelectedFormation({
                ...selectedFormation,
                time: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full"
          />

          {/* Centre */}
          <input
            type="text"
            placeholder="Nom du centre"
            value={selectedFormation.center}
            onChange={(e) =>
              setSelectedFormation({
                ...selectedFormation,
                center: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full md:col-span-2"
          />

        </div>


      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowModal(false)}
className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"        >
          Annuler
        </button>
        <button
          onClick={handleSave}
className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"        >
          Enregistrer
        </button>
      </div>
    </div>
  </>
)}



    </>
  );
}

CardTableFormations.defaultProps = {
  color: "light",
};
