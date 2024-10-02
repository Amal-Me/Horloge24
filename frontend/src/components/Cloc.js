import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import './../Clock.css';

function Cloc() {
  const [time, setTime] = useState(moment.tz(new Date(), moment.tz.guess()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment.tz(new Date(), moment.tz.guess())); // Met à jour l'heure chaque seconde
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fonction pour convertir l'heure actuelle en degrés
  function timeToDegrees(hour, minute) {
    const totalMinutes = hour * 60 + minute;
    return (totalMinutes / 1440) * 360; // 1440 minutes = 24 heures
  }

  // Récupération des heures et minutes actuelles
  const currentHours = time.hours();
  const currentMinutes = time.minutes();

  // Calcul des degrés pour l'aiguille
  const currentDegrees = timeToDegrees(currentHours, currentMinutes); // Pas de décalage cette fois

  console.log("Current Time: ", currentHours, ":", currentMinutes, " => ", currentDegrees, " degrees");

  return (
    <div className="clock">
      {/* Aiguille de l'horloge */}
      <div className="hand" style={{ transform: `rotate(${currentDegrees}deg)` }}></div>

      {/* Repères fixes pour chaque heure */}
      {[...Array(24)].map((_, index) => (
        <div key={index} className="hour-mark" style={{ transform: `rotate(${index * 15}deg)` }}>
          <div className="hour-number" style={{ transform: `rotate(${-index * 15}deg)` }}>
            {index}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Cloc;
