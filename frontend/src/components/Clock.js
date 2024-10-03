import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import HorizonLine from './HorizonLine';
import './../Clock.css';

function Clock() {
  const [time, setTime] = useState(moment.tz(new Date(), moment.tz.guess()));

  // Récupérer les données du store Redux
  const {sunrise, sunset, solarNoon } = useSelector((state) => state.sunTimes);

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

  const radius = 300; // Rayon de l'horloge

  // Convertir les événements solaires en heures locales (fuseau horaire)
  const sunriseDate = sunrise ? moment.tz(sunrise, moment.tz.guess()) : null;
  const sunsetDate = sunset ? moment.tz(sunset, moment.tz.guess()) : null;
  const solarNoonDate = solarNoon ? moment.tz(solarNoon, moment.tz.guess()) : null;

  // Angle du zénith (référence à 0°)
  const solarNoonDegrees = solarNoonDate ? timeToDegrees(solarNoonDate.hours(), solarNoonDate.minutes()) : null;

  // Ajustement pour que le zénith soit toujours en haut (0°)
  const zenithAdjustment = solarNoonDegrees ? (360 - solarNoonDegrees) : 0;

    // On ajoute un décalage de -90° pour l'aiguille et les repères car en css le 0° est a 90°
    const correctedAdjustment = zenithAdjustment - 90;


    // Calculer l'angle de l'aiguille pour l'heure actuelle avec ajustement
    const currentHours = time.hours();
    const currentMinutes = time.minutes();
    
    // Calculer l'angle de l'aiguille pour l'heure actuelle avec l'ajustement corrigé
    const currentDegrees = (timeToDegrees(currentHours, currentMinutes) + correctedAdjustment) % 360;
  
    // Calculer les angles pour le lever et le coucher du soleil avec l'ajustement corrigé
    const sunriseDegrees = sunriseDate ? (timeToDegrees(sunriseDate.hours(), sunriseDate.minutes()) + correctedAdjustment) % 360 : null;
    const sunsetDegrees = sunsetDate ? (timeToDegrees(sunsetDate.hours(), sunsetDate.minutes()) + correctedAdjustment) % 360 : null;
  
 

// Conic-gradient avec les valeurs ajustées pour un dégradé dynamique
const backgroundStyle = {
  background: `conic-gradient(
    from ${sunsetDegrees +90}deg,    /* On démarre au coucher du soleil */
    #001f3f ${sunriseDegrees - 20}deg, /* Nuit */
    #0074D9 ${sunriseDegrees }deg,   /* Lever de soleil */
    #FFF700 ${sunriseDegrees + 90}deg,  /* Lever */
    #FFD700 ${correctedAdjustment }deg,   /* Zénith */
    #FFD700 ${correctedAdjustment + 60}deg,   /* Zénith */
    #FF851B ${sunsetDegrees - 20}deg      /* Après-midi */
  )`,
};

// Logs
//console.log('Night Start (Coucher):', adjustedNightStart);
//console.log('Night End (Lever):', adjustedNightEnd);
  


  
  
  
  return (
    <div className="clock-container">
 
    <div className="clock" style={backgroundStyle}>
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

       {/* Ajouter la ligne horizontale */}
       <HorizonLine sunriseDegrees={sunriseDegrees} sunsetDegrees={sunsetDegrees} radius={radius} />
    </div>
  </div>
  );
}

export default Clock;
