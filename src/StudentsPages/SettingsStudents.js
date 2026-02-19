import React from "react";
import { Link } from "react-router-dom";

import CardSettingsStudents from "components/Cards/CardSettingsStudents.js";
import StudentNavbar from "components/Navbars/StudentNavbar";
import Footer from "components/Footers/Footer";
import TextType from "../views/TextType";

export default function Settings() {
  return (
    <>
      {/* Navbar */}
      <StudentNavbar />

      <main>
        {/* Hero Section */}
        <div className="relative pt-24 pb-32 flex content-center items-center justify-center"
          style={{ minHeight: "35vh" }}>
          
          {/* Background */}
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1267&q=80')",
            }}
          >
            <span className="absolute w-full h-full bg-black opacity-75"></span>
          </div>

          {/* Title */}
          <div className="container relative mx-auto px-4">
            <div className="flex flex-wrap justify-center text-center">
              <div className="w-full lg:w-7/12 px-4">
                <h1 className="text-white font-semibold text-5xl leading-tight">
                  <TextType
                    text={[
                      "Mon Compte.",
                      "Gérez vos informations personnelles et paramètres.",
                    ]}
                    typingSpeed={75}
                    deletingSpeed={50}
                    pauseDuration={2000}
                    showCursor
                    cursorCharacter="_"
                  />
                </h1>

                <p className="mt-6 text-lg text-blueGray-200">
                    Mettez à jour vos informations personnelles, vos compétences
  et sécurisez votre compte en toute simplicité.
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

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none h-20">
            <svg
              className="absolute bottom-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 2560 100"
            >
              <polygon
                className="fill-current text-blueGray-100"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
      </main>

      {/* Contenu Settings */}
      <section className="relative bg-blueGray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-8/12 px-4 mx-auto">
              <CardSettingsStudents />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}