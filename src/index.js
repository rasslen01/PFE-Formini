import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// layouts

import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import Centre from "layouts/Centre.js";

// views without layouts

import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
import Index from "views/Index.js";
import MesInscriptions from "StudentsPages/MesInscriptions";
import SettingsStudents from "StudentsPages/SettingsStudents";
import ListeFavoris from "StudentsPages/ListeFavoris";
import Preferences from "StudentsPages/Preference";
import { FavoritesProvider } from "./FavoritesContext";

ReactDOM.render(
  <BrowserRouter>
    <FavoritesProvider>
      <Switch>
        {/* add routes with layouts */}
      <Route path="/admin" component={Admin} />
      <Route path="/auth" component={Auth} />
      <Route path="/centre" component={Centre} />
      {/* add routes without layouts */}
      <Route path="/landing" exact component={Landing} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/mes-inscriptions" exact component={MesInscriptions} />
      <Route path="/settingsStudents" exact component={SettingsStudents} />
      <Route path="/liste-favoris" exact component={ListeFavoris} />
      <Route path="/preferences" exact component={Preferences} />


      <Route path="/" exact component={Index} />
      {/* add redirect for first page */}
      <Redirect from="*" to="/" />
    </Switch>
    </FavoritesProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
