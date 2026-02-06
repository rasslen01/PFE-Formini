import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextType from "./TextType";

// Components
import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";
import SallleDeFormation from "../assets/img/SallleDeFormation.avif";

export default function Landing() {
  // State des filtres
  const [ville, setVille] = useState("");
  const [domaine, setDomaine] = useState("");

  // Données formations (démo)
  const formations = [
    { 
      id: 1, 
      nom: "Développement Web", 
      ville: "tunis", 
      domaine: "informatique" 
    },
    { 
      id: 2, 
      nom: "Marketing Digital", 
      ville: "sfax", 
      domaine: "marketing" 
    },
    { 
      id: 3, 
      nom: "Data Science", 
      ville: "tunis", 
      domaine: "data" 
    },
  ];

  // Filtrage des formations
  const formationsFiltrees = formations.filter(
    (formation) => 
      (ville === "" || formation.ville === ville) && 
      (domaine === "" || formation.domaine === domaine)
  );

  return (
    <>
      {/* Navbar */}
      <Navbar transparent />
      
      <main>
        {/* Hero Section */}
        <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
          <div 
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80')" 
            }}
          >
            <span 
              id="blackOverlay" 
              className="w-full h-full absolute opacity-75 bg-black"
            ></span>
          </div>
          
          <div className="container relative mx-auto">
            <div className="items-center flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                <div className="pr-12">
                  <h1 className="text-white font-semibold text-5xl">
  <TextType
    text={[
      "Your story starts with us.",
      "Inscris-toi aujourd'hui et dessine ton avenir avec assurance.",
    ]}
    typingSpeed={75}
    deletingSpeed={50}
    pauseDuration={2000}
    showCursor
    cursorCharacter="_"
  />
</h1>

                  <p className="mt-4 text-lg text-blueGray-200">
                    "Chaque formation est une passerelle vers de nouvelles opportunites. 
                    Inscrit-toi aujourd'hui et dessine ton avenir avec assurance."
                  </p>
                  <div>
                  <Link
  to="/formations"
  className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
>
  <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 mt-12 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
    Voir les formations

</button>
</Link>
</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wave Divider */}
          <div 
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
            style={{ transform: "translateZ(0)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-blueGray-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </div>

        {/* Main Content Section */}
        <section className="pb-20 bg-blueGray-200 -mt-24">
          <div className="container mx-auto px-4">
            {/* Filters Row */}
            <div className="flex flex-wrap">
              
              {/* Ville Filter */}
              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="container mt-4">
                    <div className="card shadow-sm p-3" style={{ maxWidth: "400px" }}>
                      <h6 className="mb-2 text-center">
                        Trouver des formations selon la localisation
                      </h6>
                      <select 
                        className="form-select" 
                        aria-label="Default select example"
                        onChange={(e) => setVille(e.target.value)}
                        defaultValue=""
                      >
                        <option value="">Choisir l'état</option>
                        <option value="tunis">Tunis</option>
                        <option value="ariana">Ariana</option>
                        <option value="ben_arous">Ben Arous</option>
                        <option value="manouba">Manouba</option>
                        <option value="nabeul">Nabeul</option>
                        <option value="zaghouan">Zaghouan</option>
                        <option value="bizerte">Bizerte</option>
                        <option value="beja">Béja</option>
                        <option value="jendouba">Jendouba</option>
                        <option value="kef">Le Kef</option>
                        <option value="siliana">Siliana</option>
                        <option value="sousse">Sousse</option>
                        <option value="monastir">Monastir</option>
                        <option value="mahdia">Mahdia</option>
                        <option value="sfax">Sfax</option>
                        <option value="kairouan">Kairouan</option>
                        <option value="kasserine">Kasserine</option>
                        <option value="sidi_bouzid">Sidi Bouzid</option>
                        <option value="gabes">Gabès</option>
                        <option value="medenine">Médenine</option>
                        <option value="tataouine">Tataouine</option>
                        <option value="gafsa">Gafsa</option>
                        <option value="tozeur">Tozeur</option>
                        <option value="kebili">Kébili</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Domaine Filter */}
              <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="card shadow-sm p-3" style={{ maxWidth: "400px" }}>
                    <h6 className="mb-2 text-center">
                      Choisir le domaine de formation
                    </h6>
                    <select 
                      className="form-select" 
                      aria-label="Default select example"
                      onChange={(e) => setDomaine(e.target.value)}
                      defaultValue=""
                    >
                      <option value="">Choisir le domaine</option>
                      <option value="informatique">Informatique & IT</option>
                      <option value="reseaux">Réseaux & Télécom</option>
                      <option value="ia">Intelligence Artificielle</option>
                      <option value="data">Data Science</option>
                      <option value="web">Développement Web</option>
                      <option value="mobile">Développement Mobile</option>
                      <option value="gestion">Gestion & Management</option>
                      <option value="marketing">Marketing Digital</option>
                      <option value="finance">Finance & Comptabilité</option>
                      <option value="langues">Langues</option>
                      <option value="bureautique">Bureautique</option>
                      <option value="mecanique">Mécanique</option>
                      <option value="electrique">Électricité</option>
                      <option value="electronique">Électronique</option>
                      <option value="sante">Santé</option>
                      <option value="paramedical">Paramédical</option>
                      <option value="artisanat">Artisanat</option>
                      <option value="tourisme">Tourisme & Hôtellerie</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Date Filter */}
              <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="card shadow-sm p-3 mb-3" style={{ maxWidth: "400px" }}>
                    <h6 className="text-center mb-2">
                      Choisir la date
                    </h6>
                    <input type="date" className="form-control" />
                  </div>
                </div>
              </div>
            </div>

            {/* Formations Results */}
            <div className="container mx-auto px-4 mt-8">
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Formations disponibles
              </h3>
              
              <div className="flex flex-wrap">
                {formationsFiltrees.length === 0 ? (
                  <p className="text-center w-full">
                    Aucune formation trouvée
                  </p>
                ) : (
                  formationsFiltrees.map((formation) => (
                    <div 
                      key={formation.id} 
                      className="w-full md:w-4/12 px-4 mb-4"
                    >
                      <div className="bg-white shadow-lg rounded-lg p-4">
                        <h5 className="font-bold">
                          {formation.nom}
                        </h5>
                        <p className="text-blueGray-500">
                          {formation.ville} — {formation.domaine}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* About Section */}
            <div className="flex flex-wrap items-center mt-32">
              <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                  <i className="fas fa-user-friends text-xl"></i>
                </div>
                <h3 className="text-3xl mb-2 font-semibold leading-normal">
                  Working with us is a pleasure
                </h3>
                <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                  Don't let your uses guess by attaching tooltips and popoves to any element. 
                  Just make sure you enable them first via JavaScript.
                </p>
                <p className="text-lg font-light leading-relaxed mt-0 mb-4 text-blueGray-600">
                  The kit comes with three pre-built pages to help you get started faster. 
                  You can change the text and images and you're good to go. 
                  Just make sure you enable them first via JavaScript.
                </p>
                <Link to="/" className="font-bold text-blueGray-700 mt-8">
                  Check Notus React!
                </Link>
              </div>
              
              <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-lightBlue-500">
                  <img 
                    alt="..." 
                    src={SallleDeFormation}
                    className="w-full align-middle rounded-t-lg" 
                  />
                  <blockquote className="relative p-8 mb-4">
                    <svg 
                      preserveAspectRatio="none" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 583 95" 
                      className="absolute left-0 w-full block h-95-px -top-94-px"
                    >
                      <polygon 
                        points="-30,95 583,95 583,65" 
                        className="text-lightBlue-500 fill-current"
                      ></polygon>
                    </svg>
                    <h4 className="text-xl font-bold text-white">
                      Top Notch Services
                    </h4>
                    <p className="text-md font-light mt-2 text-white">
                      The Arctic Ocean freezes every winter and much of the sea-ice then thaws every summer, 
                      and that process will continue whatever happens.
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        {/* <section className="relative py-20">
          <div 
            className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
            style={{ transform: "translateZ(0)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-white fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
          
          <div className="container mx-auto px-4">
            <div className="items-center flex flex-wrap">
              <div className="w-full md:w-4/12 ml-auto mr-auto px-4">
                <img 
                  alt="..." 
                  className="max-w-full rounded-lg shadow-lg" 
                  src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" 
                />
              </div>
              
              <div className="w-full md:w-5/12 ml-auto mr-auto px-4">
                <div className="md:pr-12">
                  <div className="text-lightBlue-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-lightBlue-300">
                    <i className="fas fa-rocket text-xl"></i>
                  </div>
                  <h3 className="text-3xl font-semibold">
                    A growing company
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                    The extension comes with three pre-built pages to help you get started faster. 
                    You can change the text and images and you're good to go.
                  </p>
                  
                  <ul className="list-none mt-6">
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200 mr-3">
                            <i className="fas fa-fingerprint"></i>
                          </span>
                        </div>
                        <div>
                          <h4 className="text-blueGray-500">
                            Carefully crafted components
                          </h4>
                        </div>
                      </div>
                    </li>
                    
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200 mr-3">
                            <i className="fab fa-html5"></i>
                          </span>
                        </div>
                        <div>
                          <h4 className="text-blueGray-500">
                            Amazing page examples
                          </h4>
                        </div>
                      </div>
                    </li>
                    
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200 mr-3">
                            <i className="far fa-paper-plane"></i>
                          </span>
                        </div>
                        <div>
                          <h4 className="text-blueGray-500">
                            Dynamic components
                          </h4>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Team Section */}
        <section className="pt-20 pb-48">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center text-center mb-24">
              <div className="w-full lg:w-6/12 px-4">
                <h2 className="text-4xl font-semibold">
                  Here are our heroes
                </h2>
                <p className="text-lg leading-relaxed m-4 text-blueGray-500">
                  According to the National Oceanic and Atmospheric Administration, 
                  Ted, Scambos, NSIDClead scentist, puts the potentially record maximum.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap">
              {/* Team Member 1 */}
              <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                  <img 
                    alt="..." 
                    src={require("assets/img/team-1-800x800.jpg").default} 
                    className="shadow-lg rounded-full mx-auto max-w-120-px" 
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">
                      Ryan Tompson
                    </h5>
                    <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">
                      Web Developer
                    </p>
                    <div className="mt-6">
                      <button 
                        className="bg-lightBlue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1" 
                        type="button"
                      >
                        <i className="fab fa-twitter"></i>
                      </button>
                      <button 
                        className="bg-lightBlue-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1" 
                        type="button"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </button>
                      <button 
                        className="bg-pink-500 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1" 
                        type="button"
                      >
                        <i className="fab fa-dribbble"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Team Member 2 */}
              <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                  <img 
                    alt="..." 
                    src={require("assets/img/team-2-800x800.jpg").default} 
                    className="shadow-lg rounded-full mx-auto max-w-120-px" 
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">
                      Romina Hadid
                    </h5>
                    <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">
                      Marketing Specialist
                    </p>
                    <div className="mt-6">
                      <button 
                        className="bg-red-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1" 
                        type="button"
                      >
                        <i className="fab fa-google"></i>
                      </button>
                      <button 
                        className="bg-lightBlue-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1" 
                        type="button"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Team Member 3 */}
              <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                  <img 
                    alt="..." 
                    src={require("assets/img/team-3-800x800.jpg").default} 
                    className="shadow-lg rounded-full mx-auto max-w-120-px" 
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">
                      Alexa Smith
                    </h5>
                    <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">
                      UI/UX Designer
                    </p>
                    <div className="mt-6">
                      <button 
                        className="bg-red-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1" 
                        type="button"
                      >
                        <i className="fab fa-google"></i>
                      </button>
                      <button 
                        className="bg-lightBlue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1" 
                        type="button"
                      >
                        <i className="fab fa-twitter"></i>
                      </button>
                      <button 
                        className="bg-blueGray-700 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1" 
                        type="button"
                      >
                        <i className="fab fa-instagram"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Team Member 4 */}
              <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                  <img 
                    alt="..." 
                    src={require("assets/img/team-4-470x470.png").default} 
                    className="shadow-lg rounded-full mx-auto max-w-120-px" 
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">
                      Jenna Kardi
                    </h5>
                    <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">
                      Founder and CEO
                    </p>
                    <div className="mt-6">
                      <button 
                        className="bg-pink-500 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1" 
                        type="button"
                      >
                        <i className="fab fa-dribbble"></i>
                      </button>
                      <button 
                        className="bg-red-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1" 
                        type="button"
                      >
                        <i className="fab fa-google"></i>
                      </button>
                      <button 
                        className="bg-lightBlue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1" 
                        type="button"
                      >
                        <i className="fab fa-twitter"></i>
                      </button>
                      <button 
                        className="bg-blueGray-700 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1" 
                        type="button"
                      >
                        <i className="fab fa-instagram"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="pb-20 relative block bg-blueGray-800">
          <div 
            className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
            style={{ transform: "translateZ(0)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-blueGray-800 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
          
          <div className="container mx-auto px-4 lg:pt-24 lg:pb-64">
            <div className="flex flex-wrap text-center justify-center">
              <div className="w-full lg:w-6/12 px-4">
                <h2 className="text-4xl font-semibold text-white">
                  Build something
                </h2>
                <p className="text-lg leading-relaxed mt-4 mb-4 text-blueGray-400">
                  Put the potentially record low maximum sea ice extent tihs year down to low ice. 
                  According to the National Oceanic and Atmospheric Administration, Ted, Scambos.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap mt-12 justify-center">
              {/* Service 1 */}
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-medal text-xl"></i>
                </div>
                <h6 className="text-xl mt-5 font-semibold text-white">
                  Excelent Services
                </h6>
                <p className="mt-2 mb-4 text-blueGray-400">
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </p>
              </div>
              
              {/* Service 2 */}
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-poll text-xl"></i>
                </div>
                <h5 className="text-xl mt-5 font-semibold text-white">
                  Grow your market
                </h5>
                <p className="mt-2 mb-4 text-blueGray-400">
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </p>
              </div>
              
              {/* Service 3 */}
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-lightbulb text-xl"></i>
                </div>
                <h5 className="text-xl mt-5 font-semibold text-white">
                  Launch time
                </h5>
                <p className="mt-2 mb-4 text-blueGray-400">
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="relative block py-24 lg:pt-0 bg-blueGray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200">
                  <div className="flex-auto p-5 lg:p-10">
                    <h4 className="text-2xl font-semibold">
                      Want to work with us?
                    </h4>
                    <p className="leading-relaxed mt-1 mb-4 text-blueGray-500">
                      Complete this form and we will get back to you in 24 hours.
                    </p>
                    
                    <div className="relative w-full mb-3 mt-8">
                      <label 
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2" 
                        htmlFor="full-name"
                      >
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" 
                        placeholder="Full Name" 
                      />
                    </div>
                    
                    <div className="relative w-full mb-3">
                      <label 
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2" 
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input 
                        type="email" 
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" 
                        placeholder="Email" 
                      />
                    </div>
                    
                    <div className="relative w-full mb-3">
                      <label 
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2" 
                        htmlFor="message"
                      >
                        Message
                      </label>
                      <textarea 
                        rows="4" 
                        cols="80" 
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" 
                        placeholder="Type a message..." 
                      />
                    </div>
                    
                    <div className="text-center mt-6">
                      <button 
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                        type="button"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
}