import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import Navbar from "components/Navbars/AuthNavbar.js";
import FooterSmall from "components/Footers/FooterSmall.js";

// views
import Login from "views/auth/Login.js";
import Forget from "views/auth/forget";
import Register from "views/auth/Register.js";
import RegisterAdmin from "views/auth/RegisterAdmin";
import RegisterCentre from "views/auth/RegisterCentre";

export default function Auth() {
  return (
    <>
      <Navbar transparent />

      <main>
        <section className="relative w-full h-full py-40 min-h-screen">

          {/* 🔴 BACKGROUND */}
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage:
                "url(" +
                require("assets/img/register_bg_2.png").default +
                ")",
            }}
          ></div>

          {/* ✅ CONTENU AUTH (OBLIGATOIRE z-10) */}
          <div className="relative z-10">
            <Switch>
              <Route path="/auth/login" exact component={Login} />
              <Route path="/auth/forget" exact component={Forget} />
              <Route path="/auth/register" exact component={Register} />
              <Route path="/auth/register-admin" exact component={RegisterAdmin} />
              <Route path="/auth/register-centre" exact component={RegisterCentre} />
              <Redirect from="/auth" to="/auth/login" />
            </Switch>
          </div>

          <FooterSmall absolute />
        </section>
      </main>
    </>
  );
}
