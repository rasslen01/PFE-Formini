import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function CardTable({ color }) {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ← Nouveau state pour le filtre status
  const [searchQuery, setSearchQuery] = useState("");

  // Modal unique
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [formUser, setFormUser] = useState({
    _id: "",
    name: "",
    email: "",
    role: "STUDENT",
    xp: 0,
    isActive: true,
  });

  // Fake data initial
  useEffect(() => {
    setUsers([
      {
        _id: "1",
        name: "Ali Ben Ahmed",
        email: "ali@test.com",
        role: "ADMIN",
        xp: 120,
        isActive: true,
      },
      {
        _id: "2",
        name: "Sara Mansouri",
        email: "sara@test.com",
        role: "STUDENT",
        xp: 50,
        isActive: false,
      },
      {
        _id: "3",
        name: "Mohamed Karim",
        email: "mohamed@test.com",
        role: "CENTRE",
        xp: 80,
        isActive: true,
      },
      {
        _id: "4",
        name: "Fatima Zahra",
        email: "fatima@test.com",
        role: "STUDENT",
        xp: 30,
        isActive: false,
      },
      {
        _id: "5",
        name: "Youssef Alami",
        email: "youssef@test.com",
        role: "ADMIN",
        xp: 200,
        isActive: true,
      },
    ]);
  }, []);

  const openAddModal = () => {
    setModalType("add");
    setFormUser({
      _id: "",
      name: "",
      email: "",
      role: "STUDENT",
      xp: 0,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalType("edit");
    setFormUser({ ...user });
    setShowModal(true);
  };

  const handleSave = () => {
    if (modalType === "add") {
      const user = { ...formUser, _id: Date.now().toString() };
      setUsers([...users, user]);
    } else {
      setUsers(users.map((u) => (u._id === formUser._id ? formUser : u)));
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cet utilisateur ?")) {
      setUsers(users.filter((u) => u._id !== id));
    }
  };

  // ─────────────────────────────────────────────────────
  // Filtrage combiné : recherche + rôle + status
  // ─────────────────────────────────────────────────────
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && u.isActive === true) ||
      (statusFilter === "SUSPENDED" && u.isActive === false);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // ─────────────────────────────────────────────────────
  // Réinitialiser tous les filtres
  // ─────────────────────────────────────────────────────
  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  };

  const hasActiveFilters =
    searchQuery !== "" || roleFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <>
      <div
        className={
          "relative flex flex-col w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        {/* Header */}
        <div className="px-4 py-3 flex flex-wrap justify-between items-center gap-3">
          <h3 className="font-semibold text-lg">Gestion des utilisateurs</h3>

          <div className="flex flex-wrap gap-2 items-center">
            {/* ══════════════════════════════
                 Barre de recherche par nom
               ══════════════════════════════ */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blueGray-400">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Rechercher par nom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded px-3 py-2 pl-9 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-blueGray-400 hover:text-red-500"
                  title="Effacer"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            {/* ══════════════════════════════
                 Filtre par rôle
               ══════════════════════════════ */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border px-3 py-2 rounded text-sm"
            >
              <option value="ALL">Tous les rôles</option>
              <option value="ADMIN">Admin</option>
              <option value="CENTRE">Centre</option>
              <option value="STUDENT">Student</option>
            </select>

            {/* ══════════════════════════════
                 Filtre par status
               ══════════════════════════════ */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-3 py-2 rounded text-sm"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="ACTIVE">✅ Actif</option>
              <option value="SUSPENDED">🔴 Suspendu</option>
            </select>

            {/* ══════════════════════════════
                 Bouton réinitialiser filtres
               ══════════════════════════════ */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="bg-blueGray-200 text-blueGray-700 px-3 py-2 rounded text-sm hover:bg-blueGray-300 transition-all"
                title="Réinitialiser les filtres"
              >
                <i className="fas fa-undo mr-1"></i>
                Réinitialiser
              </button>
            )}

            <button
              onClick={openAddModal}
              className="bg-emerald-500 text-white px-4 py-2 rounded text-sm font-bold"
            >
              + Ajouter
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════
            Badges des filtres actifs
           ══════════════════════════════════════ */}
        {hasActiveFilters && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {searchQuery && (
              <span className="bg-lightBlue-100 text-lightBlue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <i className="fas fa-search text-xs"></i>
                Nom : "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            )}
            {roleFilter !== "ALL" && (
              <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <i className="fas fa-user-tag text-xs"></i>
                Rôle : {roleFilter}
                <button
                  onClick={() => setRoleFilter("ALL")}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            )}
            {statusFilter !== "ALL" && (
              <span
                className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
                  statusFilter === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <i className="fas fa-circle text-xs"></i>
                Status : {statusFilter === "ACTIVE" ? "Actif" : "Suspendu"}
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Nom", "Email", "Rôle", "XP", "Status", "Actions"].map(
                  (h, i) => (
                    <th
                      key={i}
                      className="px-6 py-3 text-left bg-blueGray-50 text-blueGray-500 text-xs uppercase"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-100">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-orange-100 text-orange-700"
                            : user.role === "CENTRE"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-lightBlue-100 text-lightBlue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.xp}</td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          ✅ Actif
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700">
                          🔴 Suspendu
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="bg-lightBlue-500 text-white font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg transition-all"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg transition-all"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-blueGray-400"
                  >
                    <i className="fas fa-user-slash text-2xl mb-2 block"></i>
                    Aucun utilisateur trouvé
                    {searchQuery && (
                      <span>
                        {" "}
                        pour "<strong>{searchQuery}</strong>"
                      </span>
                    )}
                    {statusFilter !== "ALL" && (
                      <span>
                        {" "}
                        avec status "
                        <strong>
                          {statusFilter === "ACTIVE" ? "Actif" : "Suspendu"}
                        </strong>
                        "
                      </span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer : compteur de résultats */}
        <div className="px-4 py-2 text-sm text-blueGray-400 border-t flex justify-between items-center">
          <span>
            {filteredUsers.length} résultat(s) sur {users.length} utilisateur(s)
          </span>
          {hasActiveFilters && (
            <span className="text-xs text-blueGray-300">
              <i className="fas fa-filter mr-1"></i>
              Filtres actifs
            </span>
          )}
        </div>
      </div>

      {/* Modal Unique (Add + Edit) */}
      {showModal && (
        <>
          <div className="modal-backdrop"></div>

          <div className="modal-container">
            <h3 className="text-xl font-semibold mb-4">
              {modalType === "add"
                ? "Ajouter utilisateur"
                : "Modifier utilisateur"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom"
                value={formUser.name}
                onChange={(e) =>
                  setFormUser({ ...formUser, name: e.target.value })
                }
                className="border rounded px-3 py-2 w-full md:col-span-2"
              />

              <input
                type="email"
                placeholder="Email"
                value={formUser.email}
                onChange={(e) =>
                  setFormUser({ ...formUser, email: e.target.value })
                }
                className="border rounded px-3 py-2 w-full md:col-span-2"
              />

              <select
                value={formUser.role}
                onChange={(e) =>
                  setFormUser({ ...formUser, role: e.target.value })
                }
                className="border rounded px-3 py-2 w-full md:col-span-2"
              >
                <option value="ADMIN">Admin</option>
                <option value="CENTRE">Centre</option>
                <option value="STUDENT">Student</option>
              </select>

              {/* ══════════════════════════════════════
                   Status dans le formulaire modal
                 ══════════════════════════════════════ */}
              <select
                value={formUser.isActive ? "true" : "false"}
                onChange={(e) =>
                  setFormUser({
                    ...formUser,
                    isActive: e.target.value === "true",
                  })
                }
                className="border rounded px-3 py-2 w-full md:col-span-2"
              >
                <option value="true">✅ Actif</option>
                <option value="false">🔴 Suspendu</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              >
                Annuler
              </button>

              <button
                onClick={handleSave}
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};