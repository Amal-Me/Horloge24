import React, { useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/fr';

const HorizonLine = ({ sunriseDegrees, sunsetDegrees, radius, setCoords }) => {
  // Configuration de la langue
  const userLanguage = navigator.language || 'en';
  moment.locale(userLanguage);

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
    if (angleDegrees === null) return null;
    const angleRadians = degreesToRadians(angleDegrees);
    const x = radius * Math.cos(angleRadians);
    const y = radius * Math.sin(angleRadians);
    return { x, y };
  }

  // Calculer les coordonnées seulement si les degrés sont disponibles
  const sunriseCoords = calculateCoordinates(sunriseDegrees, radius);
  const sunsetCoords = calculateCoordinates(sunsetDegrees, radius);

  useEffect(() => {
    if (sunriseCoords && sunsetCoords) {
      setCoords(sunriseCoords, sunsetCoords);
      console.log('Coordonnées envoyées au parent:', sunriseCoords, sunsetCoords);
    }
  }, [sunriseCoords, sunsetCoords, setCoords]);

  // Ne rien rendre si les coordonnées ne sont pas disponibles
  if (!sunriseCoords || !sunsetCoords) {
    return null;
  }

  return (
    <div>
      <svg width={radius * 2} height={radius * 2} style={{ position: 'absolute', top: 0, left: 0 }}>
        <line
          x1={sunriseCoords.x + radius}
          y1={sunriseCoords.y + radius}
          x2={sunsetCoords.x + radius}
          y2={sunsetCoords.y + radius}
          className="horizon-line"
        />
      </svg>

      {/* Label pour "Lever" */}
      <div
        style={{
          position: 'absolute',
          left: `${sunriseCoords.x + radius}px`,
          top: `${sunriseCoords.y + radius}px`,
          transform: 'translate(-150%, -80%)',
          color: 'black',
          fontSize: '2rem',
        }}
      >
        Lever
      </div>

      {/* Label pour "Coucher" */}
      <div
        style={{
          position: 'absolute',
          left: `${sunsetCoords.x + radius}px`,
          top: `${sunsetCoords.y + radius}px`,
          transform: 'translate(35%, -80%)',
          color: 'black',
          fontSize: '2rem',
        }}
      >
        Coucher
      </div>

      {/* Date actuelle au-dessus de la ligne */}
      <div
        style={{
          position: 'absolute',
          left: `${(sunriseCoords.x + sunsetCoords.x) / 2 + radius}px`,
          top: `${(sunriseCoords.y + sunsetCoords.y) / 2 + radius - 20}px`,
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

