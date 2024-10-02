import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import './../Clock.css';

function Clock() {
  const [time, setTime] = useState(moment.tz(new Date(), moment.tz.guess()));

  // Récupérer les données du store Redux
  const {sunrise, sunset, solarNoon } = useSelector((state) => state.sunTimes);

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

  // Convertir les événements solaires en heures locales
  const sunriseDate = sunrise ? moment.tz(sunrise, moment.tz.guess()) : null;
  const sunsetDate = sunset ? moment.tz(sunset, moment.tz.guess()) : null;
  const solarNoonDate = solarNoon ? moment.tz(solarNoon, moment.tz.guess()) : null;

  // Angle du zénith (référence à 0°)
  const solarNoonDegrees = solarNoonDate ? timeToDegrees(solarNoonDate.hours(), solarNoonDate.minutes()) : null;

  // Ajustement pour que le zénith soit toujours en haut (0°)
  const zenithAdjustment = solarNoonDegrees ? (360 - solarNoonDegrees) : 0;

    // On ajoute un décalage de 90° pour l'aiguille et les repères
    const correctedAdjustment = zenithAdjustment - 90;


    // Calculer l'angle de l'aiguille pour l'heure actuelle avec ajustement
    const currentHours = time.hours();
    const currentMinutes = time.minutes();
    
    // Calculer l'angle de l'aiguille pour l'heure actuelle avec l'ajustement corrigé
    const currentDegrees = (timeToDegrees(currentHours, currentMinutes) + correctedAdjustment) % 360;
  
    // Calculer les angles pour le lever et le coucher du soleil avec l'ajustement corrigé
    const sunriseDegrees = sunriseDate ? (timeToDegrees(sunriseDate.hours(), sunriseDate.minutes()) + correctedAdjustment) % 360 : null;
    const sunsetDegrees = sunsetDate ? (timeToDegrees(sunsetDate.hours(), sunsetDate.minutes()) + correctedAdjustment) % 360 : null;
  

  // Calculer les angles pour le lever et le coucher du soleil avec ajustement
  //const sunriseDegrees = sunriseDate ? (timeToDegrees(sunriseDate.hours(), sunriseDate.minutes()) + zenithAdjustment) % 360 : null;
  //const sunsetDegrees = sunsetDate ? (timeToDegrees(sunsetDate.hours(), sunsetDate.minutes()) + zenithAdjustment) % 360 : null;

  
  //const currentDegrees = (timeToDegrees(currentHours, currentMinutes) + zenithAdjustment) % 360;

  // Logs pour vérifier les angles
  console.log("Current Degrees:", currentDegrees);
  console.log("Sunrise Degrees:", sunriseDegrees);
  console.log("Sunset Degrees:", sunsetDegrees);
  console.log("Solar Noon Degrees:", solarNoonDegrees);

  return (
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

      {/* Un repère unique pour le lever */}
      {sunriseDegrees !== null && (
        <div className="marker" style={{ transform: `rotate(${sunriseDegrees}deg)` }}>
          <div className="marker-label"style={{ transform: `rotate(${-sunriseDegrees}deg)` }}>Lever</div>
        </div>
      )}

      {/* Un repère unique pour le coucher */}
      {sunsetDegrees !== null && (
        <div className="marker" style={{ transform: `rotate(${sunsetDegrees}deg)` }}>
          <div className="marker-label"style={{ transform: `rotate(${-sunsetDegrees}deg)` }}>Coucher</div>
        </div>
      )}

      {/* Le repère du zénith, toujours en haut */}
      {solarNoonDegrees !== null && (
        <div className="marker" style={{ transform: `rotate(-90deg)` }}>
          <div className="marker-label"style={{ transform: 'rotate(90deg)' }}>Zénith</div>
        </div>
      )}
    </div>
  );
}

export default Clock;
