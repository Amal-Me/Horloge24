import React from 'react';
import moment from 'moment';
import 'moment/locale/fr'; // Charger les langues nécessaires

// Utiliser la langue de l'utilisateur
const userLanguage = navigator.language || 'en'; 
moment.locale(userLanguage); // Adapter moment à la langue détectée

// Fonction pour convertir les degrés en radians
function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// Fonction pour capitaliser la première lettre de chaque mot
function capitalizeFirstLetter(dateString) {
    return dateString
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

// Récupération et formatage de la date basé sur la langue du navigateur
const currentDate = capitalizeFirstLetter(moment().format('dddd D MMMM YYYY'));

 

// Fonction pour calculer les coordonnées cartésiennes
function calculateCoordinates(angleDegrees, radius) {
  const angleRadians = degreesToRadians(angleDegrees);
  const x = radius * Math.cos(angleRadians);
  const y = radius * Math.sin(angleRadians);
  return { x, y };
}

const HorizonLine = ({ sunriseDegrees, sunsetDegrees, radius , sunriseTime = '', sunsetTime = '' }) => {
  if (sunriseDegrees === null || sunsetDegrees === null) {
    return null; // Si les degrés sont nuls, ne pas afficher la ligne
  }

  // Calculer les coordonnées pour le lever et le coucher du soleil
  const sunriseCoords = calculateCoordinates(sunriseDegrees , radius);
  const sunsetCoords = calculateCoordinates(sunsetDegrees , radius);

  // Logs pour voir si les coordonnées sont correctes
 // console.log("Sunrise Coords:", sunriseCoords);
 // console.log("Sunset Coords:", sunsetCoords);

  return (
    <div>
    <svg width="600" height="600" style={{ position: 'absolute', top: 0, left: 0 }}>
  <line
    x1={sunriseCoords.x + radius}
    y1={sunriseCoords.y + radius}
    x2={sunsetCoords.x + radius}
    y2={sunsetCoords.y + radius}
    className="horizon-line"
  />
</svg>
 {/* Label pour "Lever" */}
 <div className="marker-labelB"
        style={{
          position: 'absolute',
          left: `${sunriseCoords.x + radius}px`,
          top: `${sunriseCoords.y + radius}px`,
          transform: 'translate(-150%, -80%)', // Pour centrer le texte par rapport au point
          color: 'black',
          fontSize: '2rem',
        }}
      >
         {sunriseTime ? `Lever - ${sunriseTime}` : 'Lever'}
      </div>

      {/* Label pour "Coucher" */}
      <div className="marker-labelB"
        style={{
          position: 'absolute',
          left: `${sunsetCoords.x + radius}px`,
          top: `${sunsetCoords.y + radius}px`,
          transform: 'translate(35%, -80%)', // Pour centrer le texte par rapport au point
          color: 'black',
          fontSize: '2rem',
        }}
      >
         {sunsetTime ? `Coucher - ${sunsetTime}` : 'Coucher'}
      </div>
      {/* Date actuelle au-dessus de la ligne */}
      <div
        style={{
          position: 'absolute',
          left: `${(sunriseCoords.x + sunsetCoords.x) / 2 + radius}px`, // Milieu de la ligne
          top: `${(sunriseCoords.y + sunsetCoords.y) / 2 + radius - 20}px`, // Légèrement au-dessus de la ligne
          transform: 'translate(-50%, -50%)',
          color: 'black',
          fontSize: '1.5rem',
        }}
      >
        {currentDate}
        </div>
</div>

  );
};

export default HorizonLine;