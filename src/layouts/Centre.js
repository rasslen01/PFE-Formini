// ═══════════════════════════════════════════════
// 📁 src/layouts/Centre.js
// ═══════════════════════════════════════════════

import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import CentreNavbar from "components/Navbars/CentreNavbar.js";

import CentreDashboard from "views/Centre/CentreDashboard.js";
import CentreFormations from "views/Centre/CentreFormations.js";
import CentreStudents from "views/Centre/CentreStudents.js";
import CentreCalendar from "views/Centre/CentreCalendar.js";
import CentreProfile from "views/Centre/CentreProfile.js";
import CentreStats from "views/Centre/CentreStats.js";

export default function Centre() {
  return (
    <>
      <CentreNavbar />

      {/* mt-12 = hauteur navbar h-12 (48px) */}
      <div className="bg-blueGray-100 min-h-screen mt-12">
        <div className="px-4 md:px-10 mx-auto w-full py-4">
          <Switch>
            <Route path="/centre/dashboard" exact component={CentreDashboard} />
            <Route path="/centre/formations" exact component={CentreFormations} />
            <Route path="/centre/students" exact component={CentreStudents} />
            <Route path="/centre/calendar" exact component={CentreCalendar} />
            <Route path="/centre/profile" exact component={CentreProfile} />
            <Route path="/centre/stats" exact component={CentreStats} />
            <Redirect from="/centre" to="/centre/dashboard" />
          </Switch>
        </div>
      </div>
    </>
  );
}