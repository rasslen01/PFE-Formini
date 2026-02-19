import React from "react";
import { Link } from "react-router-dom";

// components
import StudentNavbar from "components/Navbars/StudentNavbar";
import Footer from "components/Footers/Footer";
import TextType from "../views/TextType";

export default function Landing() {
  return (
    <>
      {/* Navbar */}
      <StudentNavbar />

      <main>
        {/* Hero Section */}
        <div className="relative pt-24 pb-32 flex content-center items-center justify-center min-h-screen">
          {/* Background image */}
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1267&q=80')",
            }}
          >
            <span className="absolute w-full h-full bg-black opacity-75"></span>
          </div>

          {/* Content */}
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

          {/* Wave Divider */}
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
{/* CONTENU SCROLLABLE */}
<section className="relative bg-blueGray-100 py-16">
  <div className="container mx-auto px-4">
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
        <tr className="border-t">
          <td className="px-6 py-4 text-sm text-blueGray-700">
            Développement Web
          </td>
          <td className="px-6 py-4 text-sm text-blueGray-700">
            Centre IT
          </td>
          <td className="px-6 py-4 text-sm text-blueGray-700">
            12/03/2026
          </td>
          <td className="px-6 py-4 text-sm font-bold text-orange-500">
            pending
          </td>
          <td className="px-6 py-4 flex gap-2">
            <button className="bg-emerald-500 text-white text-xs px-4 py-2 rounded">
              Confirmer
            </button>
            <button className="bg-red-500 text-white text-xs px-4 py-2 rounded">
              Annuler
            </button>
          </td>
        </tr>

        <tr className="border-t">
          <td className="px-6 py-4 text-sm text-blueGray-700">
            UI / UX Design
          </td>
          <td className="px-6 py-4 text-sm text-blueGray-700">
            Design Academy
          </td>
          <td className="px-6 py-4 text-sm text-blueGray-700">
            20/03/2026
          </td>
          <td className="px-6 py-4 text-sm font-bold text-emerald-500">
            confirmé
          </td>
          <td className="px-6 py-4 text-xs italic text-blueGray-400">
            Action terminée
          </td>
        </tr>

        <tr className="border-t">
          <td className="px-6 py-4 text-sm text-blueGray-700">
            Data Science
          </td>
          <td className="px-6 py-4 text-sm text-blueGray-700">
            Tech Lab
          </td>
          <td className="px-6 py-4 text-sm text-blueGray-700">
            28/03/2026
          </td>
          <td className="px-6 py-4 text-sm font-bold text-red-500">
            annulé
          </td>
          <td className="px-6 py-4 text-xs italic text-blueGray-400">
            Action terminée
          </td>
        </tr>
      </tbody>
      </table>
    </div>
  </div>
</section>



      {/* Footer */}
      <Footer />
    </>
  );
}
