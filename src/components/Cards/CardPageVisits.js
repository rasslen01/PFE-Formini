import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CardPageVisits() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/logs/recent", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        // Adaptez selon la structure de votre réponse backend
        // Ex: data.logs, data.data, ou directement data (tableau)
        setLogs(Array.isArray(data) ? data : data.logs ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const getLevelStyle = (level) => {
    switch (level) {
      case "INFO":      return "text-lightBlue-500";
      case "WARNING":   return "text-amber-500";
      case "ERROR":     return "text-red-500";
      case "CRITICAL":  return "text-red-600";
      default:          return "text-blueGray-500";
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case "INFO":      return "fas fa-info-circle";
      case "WARNING":   return "fas fa-exclamation-triangle";
      case "ERROR":     return "fas fa-times-circle";
      case "CRITICAL":  return "fas fa-skull-crossbones";
      default:          return "fas fa-circle";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Success": return "fas fa-arrow-up text-emerald-500";
      case "Failed":  return "fas fa-arrow-down text-orange-500";
      case "Error":   return "fas fa-arrow-down text-red-500";
      case "Blocked": return "fas fa-ban text-red-600";
      default:        return "fas fa-minus text-blueGray-400";
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      {/* Header */}
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-base text-blueGray-700">
              <i className="fas fa-clipboard-list text-lightBlue-500 mr-2"></i>
              Recent Logs
            </h3>
          </div>
          <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
            <Link
              to="/admin/logs"
              className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            >
              See all
            </Link>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-10 text-blueGray-400">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          <span className="text-sm">Chargement des logs...</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex justify-center items-center py-10 text-red-500">
          <i className="fas fa-exclamation-circle mr-2"></i>
          <span className="text-sm">Erreur : {error}</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && logs.length === 0 && (
        <div className="flex justify-center items-center py-10 text-blueGray-400">
          <i className="fas fa-inbox mr-2"></i>
          <span className="text-sm">Aucun log disponible.</span>
        </div>
      )}

      {/* Table */}
      {!loading && !error && logs.length > 0 && (
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                {["Timestamp", "Level", "User", "Action", "Status"].map((col) => (
                  <th
                    key={col}
                    className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    <span className="font-mono text-blueGray-500">{log.timestamp}</span>
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <i className={`${getLevelIcon(log.level)} ${getLevelStyle(log.level)} mr-2`}></i>
                    <span className={`font-bold ${getLevelStyle(log.level)}`}>{log.level}</span>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {log.user}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold">
                    {log.action}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <i className={`${getStatusIcon(log.status)} mr-4`}></i>
                    {log.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}