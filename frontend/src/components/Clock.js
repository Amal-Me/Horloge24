import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import HorizonLine from './HorizonLine';
import { fetchSunTimes } from '../redux/actions/sunTimesActions';
import './../Clock.css';

function Clock() {
  const [time, setTime] = useState(moment.tz(new Date(), moment.tz.guess()));
  const dispatch = useDispatch();
  // Récupérer les données du store Redux
  const {sunrise, sunset, solarNoon, civilTwilightBegin, civilTwilightEnd, error} = useSelector((state) => state.sunTimes);  

   // Gérer la géolocalisation et déclencher l'action pour récupérer les horaires solaires
   useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(fetchSunTimes(latitude, longitude));
      },
      (error) => console.error('Erreur de géolocalisation :', error)
    );
  }, [dispatch]);

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
  const userTimeZone = moment.tz.guess();
  const sunriseDate = sunrise ? moment.utc(sunrise).tz(userTimeZone) : null;
  const sunsetDate = sunset ? moment.utc(sunset).tz(userTimeZone) : null;
  const solarNoonDate = solarNoon ? moment.utc(solarNoon).tz(userTimeZone) : null;
  const civilTwilightBeginDate = civilTwilightBegin ? moment.utc(civilTwilightBegin).tz(userTimeZone) : null;
  const civilTwilightEndDate = civilTwilightEnd ? moment.utc(civilTwilightEnd).tz(userTimeZone) : null;

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
    const civilTwilightBeginDegrees = civilTwilightBeginDate ? (timeToDegrees(civilTwilightBeginDate.hours(), civilTwilightBeginDate.minutes()) + correctedAdjustment) % 360 : null;
    const civilTwilightEndDegrees = civilTwilightEndDate ? (timeToDegrees(civilTwilightEndDate.hours(), civilTwilightEndDate.minutes()) + correctedAdjustment) % 360 : null;
 

// Conic-gradient avec les valeurs ajustées pour un dégradé dynamique
const backgroundStyle = {
    background: `conic-gradient(
      from ${sunsetDegrees + 90}deg,    /* On démarre au coucher du soleil */
      rgba(3, 64, 143, 0.3) ${sunriseDegrees - 20}deg, /* Nuit */
      rgba(0, 116, 217, 0.2) ${sunriseDegrees}deg,   /* Lever de soleil */
      rgba(255, 247, 0, 0.3) ${sunriseDegrees + 90}deg,  /* Lever */
      rgba(255, 215, 0, 0.3) ${correctedAdjustment + 80}deg,   /* Zénith */
      rgba(255, 133, 27, 0.3) ${sunsetDegrees - 10}deg      /* Après-midi */  
    )`,
  };
 
  // Affichage conditionnel en cas d'erreur ou de données non prêtes
  if (error) {
    return <p>Erreur: {error.message}</p>;
  }

  console.log("Sunrise Time:", sunrise ? moment.tz(sunrise, moment.tz.guess()).format('HH:mm') : '');
console.log("Sunset Time:", sunset ? moment.tz(sunset, moment.tz.guess()).format('HH:mm') : '');

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
          <div className="marker-label"style={{ transform: 'rotate(90deg)' }}>Zénith {solarNoonDate.format('HH[h]mm')}</div>
        </div>
      )}

      {/* markers pour les premières lueurs */}
      {civilTwilightBeginDegrees !== null && (
        <div className="markerB" style={{ transform: `rotate(${civilTwilightBeginDegrees}deg)` }}>
          {/* on déduit l'angle du marker pour le positionner à l'horizontal pr + de lisibilité */}
          <div className="marker-labelB" style={{ transform: `rotate(${- civilTwilightBeginDegrees}deg)` }}>Premières lueurs - {civilTwilightBeginDate.format('HH[h]mm')} </div>
        </div>
      )}

      {/* markers pour les dernières lueurs */}
      {civilTwilightEndDegrees !== null && (
        <div className="markerB" style={{ transform: `rotate(${civilTwilightEndDegrees}deg)` }}>
          <div className="marker-labelB"style={{ transform: `rotate(${-civilTwilightEndDegrees}deg)` }}>Dernières lueurs - {civilTwilightEndDate.format('HH[h]mm')}</div>
        </div>
      )}


       {/* Ajouter la ligne horizontale */}
       <HorizonLine 
      sunriseDegrees={sunriseDegrees}
      sunsetDegrees={sunsetDegrees}
      radius={radius}
      sunriseTime={sunrise ? moment.tz(sunrise, moment.tz.guess()).format('HH:mm') : ''}
      sunsetTime={sunset ? moment.tz(sunset, moment.tz.guess()).format('HH:mm') : ''}
      />

    </div>
  </div>
  );
}

export default Clock;