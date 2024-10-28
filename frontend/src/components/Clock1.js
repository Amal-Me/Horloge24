import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import HorizonLine from './HorizonLine';
import './../Clock.css';

function Clock1() {
  const radius = 300;
  const [time, setTime] = useState(moment.tz(new Date(), moment.tz.guess()));

  // Récupérer les données du store Redux
  const { sunrise, sunset, solarNoon } = useSelector((state) => state.sunTimes);

  // Mettre à jour l'heure actuelle toutes les minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment.tz(new Date(), moment.tz.guess()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fonction pour convertir l'heure actuelle en degrés
  function timeToDegrees(hour, minute) {
    const totalMinutes = hour * 60 + minute;
    return (totalMinutes / 1440) * 360; // 1440 minutes dans 24 heures
  }

  // Convertir les événements solaires en heures locales (fuseau horaire)
  const sunriseDate = sunrise ? moment.tz(sunrise, moment.tz.guess()) : null;
  const sunsetDate = sunset ? moment.tz(sunset, moment.tz.guess()) : null;
  const solarNoonDate = solarNoon ? moment.tz(solarNoon, moment.tz.guess()) : null;

  // Angle du zénith (référence à 0°)
  const solarNoonDegrees = solarNoonDate ? timeToDegrees(solarNoonDate.hours(), solarNoonDate.minutes()) : null;
  const zenithAdjustment = solarNoonDegrees ? (360 - solarNoonDegrees) : 0;
  const correctedAdjustment = zenithAdjustment - 90;

  // Calculer l'angle de l'aiguille pour l'heure actuelle
  const currentHours = time.hours();
  const currentMinutes = time.minutes();
  const currentDegrees = (timeToDegrees(currentHours, currentMinutes) + correctedAdjustment) % 360;

  // Calculer les angles pour le lever et le coucher du soleil avec l'ajustement corrigé
  const sunriseDegrees = sunriseDate ? (timeToDegrees(sunriseDate.hours(), sunriseDate.minutes()) + correctedAdjustment) % 360 : null;
  const sunsetDegrees = sunsetDate ? (timeToDegrees(sunsetDate.hours(), sunsetDate.minutes()) + correctedAdjustment) % 360 : null;

  // Fonction pour dessiner un arc (section jour ou nuit)
  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

     // Calculer la différence d'angle pour déterminer la taille de l'arc
  let diffAngle = endAngle - startAngle;
  if (diffAngle < 0) {
    diffAngle += 360; // Assurer une valeur positive dans un cercle complet
  }

   // Définir largeArcFlag en fonction de la différence d'angle
   const largeArcFlag = diffAngle > 180 ? "1" : "0";


    //const largeArcFlag = "0"; 
    //const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? "1" : "0"; // Ajustement pour une bonne couverture

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", x, y,
      "Z"
    ].join(" ");
  }

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  return (
    <div className="clock-container">
      <svg width={radius * 2 } height={radius * 2 } style={{ position: 'absolute', top: 5, left: 5 }}>
        {/* Définir des dégradés pour le jour et la nuit */}
        <defs>
  {/* Dégradé pour la journée */}
  <linearGradient id="dayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style={{ stopColor: "#FDE910", stopOpacity: 0.1 }} /> {/* Lever du soleil : jaune clair */}
    <stop offset="30%" style={{ stopColor: "#FFD700", stopOpacity: 0.4 }} /> {/* Matin : Jaune vif */}
    <stop offset="50%" style={{ stopColor: "#FFA500", stopOpacity: 0.4 }} /> {/* Midi : Orange */}
    <stop offset="70%" style={{ stopColor: "#FF8C00", stopOpacity: 0.6 }} /> {/* Fin d'après-midi : Orange foncé */}
    <stop offset="100%" style={{ stopColor: "#FF4500", stopOpacity: 0.7 }} /> {/* Coucher du soleil : Rouge-orangé */}
  </linearGradient>

  {/* Dégradé pour la nuit (inversé pour avoir le bleu clair à l'aube) */}
  <linearGradient id="nightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style={{ stopColor: "#87CEEB", stopOpacity: 0.1 }} /> {/* Aube : Bleu ciel clair */}
    <stop offset="20%" style={{ stopColor: "#4682B4", stopOpacity: 0.2 }} /> {/* Bleu acier */}
    <stop offset="50%" style={{ stopColor: "#0000CD", stopOpacity: 0.3 }} /> {/* Bleu royal pour un effet plus marqué */}
    <stop offset="70%" style={{ stopColor: "#00008B", stopOpacity: 0.4 }} /> {/* Bleu foncé (bleu nuit) */}
    <stop offset="100%" style={{ stopColor: "#000080", stopOpacity: 0.4 }} /> {/* Nuit profonde */}
  </linearGradient>
</defs>


        {/* Section nuit */}
        {sunriseDegrees !== null && sunsetDegrees !== null && (
          <path
            d={describeArc(radius + 5, radius + 5, radius - 5, (sunsetDegrees + correctedAdjustment) % 360, (sunriseDegrees + correctedAdjustment) % 360)}
            fill="url(#nightGradient)"
          />
        )}

        {/* Section jour */}
        {sunriseDegrees !== null && sunsetDegrees !== null && (
          <path
            d={describeArc(radius + 5, radius + 5, radius - 5, (sunriseDegrees + correctedAdjustment) % 360, (sunsetDegrees + correctedAdjustment) % 360)}
            fill="url(#dayGradient)"
          />
        )}
      </svg>

      <div className="clock">
        {/* Aiguille de l'horloge */}
        <div className="hand" style={{ transform: `rotate(${currentDegrees}deg)` }}></div>

        {/* Repères fixes pour chaque heure */}
        {[...Array(24)].map((_, index) => (
          <div key={index} className="hour-mark" style={{ transform: `rotate(${(index * 15 + zenithAdjustment) % 360}deg)` }}>
            <div className="hour-number" style={{ transform: `rotate(${-(index * 15 + zenithAdjustment) % 360}deg)` }}>
              {index}
            </div>
          </div>
        ))}

        {/* Le repère du zénith, toujours en haut */}
      {solarNoonDegrees !== null && (
        <div className="marker" style={{ transform: `rotate(-90deg)` }}>
          <div className="marker-label"style={{ transform: 'rotate(90deg)' }}>Zénith</div>
        </div>
      )}

         {/* Ligne de l'horizon */}
         <HorizonLine 
          sunriseDegrees={sunriseDegrees} 
          sunsetDegrees={sunsetDegrees} 
          radius={radius} 
        />
      </div>
    </div>
  );
}

export default Clock1;




