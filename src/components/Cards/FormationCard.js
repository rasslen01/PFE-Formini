import React from "react";
import { Link } from "react-router-dom";

export default function FormationCard({ 
  formation, 
  user, 
  isEnrolled, 
  onInscription, 
  onDesinscription, 
  config 
}) {
  const competences = formation.competences?.split(",") || [];
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
      {/* Image avec liens */}
      <div className="relative h-48 overflow-hidden">
        <Link to={`/landing/detailscours/${formation._id}`}>
          <img
            alt={formation.titre}
            src={`${process.env.REACT_APP_API_URL_IMAGE_FORMATIONS}/${formation.image_Formation}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Avatar formateur */}
        {formation.formateur && (
          <Link
            to={`/profile/ProfileFormateur/${formation.formateur._id}`}
            className="absolute top-4 right-4"
          >
            <img
              alt="Formateur"
              src={`${process.env.REACT_APP_API_URL_IMAGE_USERS}/${formation.formateur.image_user}`}
              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
            />
          </Link>
        )}
      </div>
      
      {/* Contenu */}
      <div className="p-6">
        {/* Tags de compétences */}
        <div className="flex flex-wrap gap-2 mb-4">
          {competences.slice(0, 3).map((competence, index) => (
            <span
              key={index}
              className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
            >
              {competence.trim()}
            </span>
          ))}
          {competences.length > 3 && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-50 text-gray-500">
              +{competences.length - 3}
            </span>
          )}
        </div>
        
        {/* Titre et description */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {formation.titre}
        </h3>
        <p className="text-gray-600 mb-6 line-clamp-3">
          {formation.description || "Pas de description disponible"}
        </p>
        
        {/* Bouton d'inscription */}
        {user && user.role !== "centre" && (
          <div className="mt-4">
            {!isEnrolled ? (
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => onInscription(formation._id, config)}
              >
                S'inscrire maintenant
              </button>
            ) : (
              <button
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => onDesinscription(formation._id, config)}
              >
                Annuler l'inscription
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}