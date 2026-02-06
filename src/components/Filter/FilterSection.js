import React from "react";

export default function FilterSection({
  title,
  selectedState,
  selectedCity,
  selectedDomaine,
  selectedSousDomaine,
  selectedJour,
  selectedTrancheHoraire,
  onStateChange,
  onCityChange,
  onDomaineChange,
  onSousDomaineChange,
  onJourChange,
  onTrancheHoraireChange,
  states = [],
  citiesByState = {},
  ListeDomaine = {},
  joursList = [],
  tranchesHorairesList = []
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      
      {/* Localisation Filter */}
      {(selectedState !== undefined || selectedCity !== undefined) && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              État
            </label>
            <select
              value={selectedState}
              onChange={onStateChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">Choisir l'état</option>
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          
          {selectedState && citiesByState[selectedState] && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <select
                value={selectedCity}
                onChange={onCityChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Choisir la ville</option>
                {citiesByState[selectedState].map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      
      {/* Domaine Filter */}
      {(selectedDomaine !== undefined || selectedSousDomaine !== undefined) && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domaine
            </label>
            <select
              value={selectedDomaine}
              onChange={onDomaineChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">Choisir un domaine</option>
              {Object.keys(ListeDomaine).map((domaine) => (
                <option key={domaine} value={domaine}>
                  {domaine}
                </option>
              ))}
            </select>
          </div>
          
          {selectedDomaine && ListeDomaine[selectedDomaine] && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sous-domaine
              </label>
              <select
                value={selectedSousDomaine}
                onChange={onSousDomaineChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Choisir un sous-domaine</option>
                {ListeDomaine[selectedDomaine].map((sousDomaine) => (
                  <option key={sousDomaine} value={sousDomaine}>
                    {sousDomaine}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      
      {/* Jour et Horaire Filter */}
      {(selectedJour !== undefined || selectedTrancheHoraire !== undefined) && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jour
            </label>
            <select
              value={selectedJour}
              onChange={onJourChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">Choisir un jour</option>
              {joursList.map((jour) => (
                <option key={jour} value={jour}>
                  {jour}
                </option>
              ))}
            </select>
          </div>
          
          {selectedJour && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tranche horaire
              </label>
              <select
                value={selectedTrancheHoraire}
                onChange={onTrancheHoraireChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Choisir une tranche horaire</option>
                {tranchesHorairesList.map((tranche) => (
                  <option key={tranche} value={tranche}>
                    {tranche}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}