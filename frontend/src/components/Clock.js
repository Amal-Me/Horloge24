import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import HorizonLine from './HorizonLine';
import './../Clock.css';

function Clock() {
  const radius = 300;
  const [time, setTime] = useState(moment.tz(new Date(), moment.tz.guess()));
  const [sunriseCoords, setSunriseCoords] = useState(null);
  const [sunsetCoords, setSunsetCoords] = useState(null);

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

  // Fonction pour récupérer les coordonnées depuis HorizonLine
  const handleSetCoords = (sunrise, sunset) => {
    setSunriseCoords(sunrise);
    setSunsetCoords(sunset);
  };

  // Calcul optimisé des styles pour les sections jour/nuit
  const dayNightStyles = React.useMemo(() => {
    if (!sunriseCoords || !sunsetCoords) {
      return {
        day: { clipPath: 'none' },
        night: { clipPath: 'none' }
      };
    }

    return {
      day: {
        clipPath: `polygon(${sunriseCoords.x + radius}px ${sunriseCoords.y + radius}px, 
                         ${sunsetCoords.x + radius}px ${sunsetCoords.y + radius}px, 
                         100% 100%, 0% 100%)`,
        background: 'linear-gradient(to top, yellow, lightblue)'
      },
      night: {
        clipPath: `polygon(${sunsetCoords.x + radius}px ${sunsetCoords.y + radius}px, 
                         ${sunriseCoords.x + radius}px ${sunriseCoords.y + radius}px, 
                         0% 0%, 100% 0%)`,
        background: 'linear-gradient(to bottom, midnightblue, black)'
      }
    };
  }, [sunriseCoords, sunsetCoords, radius]);

  return (
    <div className="clock-container">
      {sunriseCoords && sunsetCoords && (
        <>
          <div className="day-section" style={dayNightStyles.day} />
          <div className="night-section" style={dayNightStyles.night} />
        </>
      )}

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

        {/* Ligne de l'horizon */}
        <HorizonLine 
          sunriseDegrees={sunriseDegrees} 
          sunsetDegrees={sunsetDegrees} 
          radius={radius} 
          setCoords={handleSetCoords}
        />
      </div>
    </div>
  );
}

export default Clock;