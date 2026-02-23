// ═══════════════════════════════════════════════
// 📁 src/components/Cards/CardPageVisits.js
// ═══════════════════════════════════════════════

import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CardPageVisits() {
  const [logs] = useState([
    {
      _id: "1",
      timestamp: "2025-01-20 09:15",
      level: "INFO",
      type: "AUTH",
      user: "ali@test.com",
      action: "User Login",
      status: "Success",
    },
    {
      _id: "2",
      timestamp: "2025-01-20 09:20",
      level: "WARNING",
      type: "AUTH",
      user: "unknown@test.com",
      action: "Failed Login",
      status: "Failed",
    },
    {
      _id: "3",
      timestamp: "2025-01-20 09:35",
      level: "INFO",
      type: "USER",
      user: "admin@formini.com",
      action: "User Created",
      status: "Success",
    },
    {
      _id: "4",
      timestamp: "2025-01-20 10:00",
      level: "ERROR",
      type: "SYSTEM",
      user: "system",
      action: "Database Error",
      status: "Error",
    },
    {
      _id: "5",
      timestamp: "2025-01-20 11:00",
      level: "CRITICAL",
      type: "AUTH",
      user: "hacker@evil.com",
      action: "Brute Force Detected",
      status: "Blocked",
    },
  ]);

  const getLevelStyle = (level) => {
    switch (level) {
      case "INFO":
        return "text-lightBlue-500";
      case "WARNING":
        return "text-amber-500";
      case "ERROR":
        return "text-red-500";
      case "CRITICAL":
        return "text-red-600";
      default:
        return "text-blueGray-500";
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case "INFO":
        return "fas fa-info-circle";
      case "WARNING":
        return "fas fa-exclamation-triangle";
      case "ERROR":
        return "fas fa-times-circle";
      case "CRITICAL":
        return "fas fa-skull-crossbones";
      default:
        return "fas fa-circle";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Success":
        return "fas fa-arrow-up text-emerald-500";
      case "Failed":
        return "fas fa-arrow-down text-orange-500";
      case "Error":
        return "fas fa-arrow-down text-red-500";
      case "Blocked":
        return "fas fa-ban text-red-600";
      default:
        return "fas fa-minus text-blueGray-400";
    }
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
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
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Timestamp
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Level
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  User
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Action
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    <span className="font-mono text-blueGray-500">
                      {log.timestamp}
                    </span>
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <i className={`${getLevelIcon(log.level)} ${getLevelStyle(log.level)} mr-2`}></i>
                    <span className={`font-bold ${getLevelStyle(log.level)}`}>
                      {log.level}
                    </span>
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
      </div>
    </>
  );
}