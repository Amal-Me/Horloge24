import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import './../Clock.css';


function Clock2() {
    const [time, setTime] = useState(moment.tz(new Date(), moment.tz.guess()));
  
    useEffect(() => {
      const interval = setInterval(() => {
        setTime(moment.tz(new Date(), moment.tz.guess()));
      }, 1000);
      return () => clearInterval(interval);
    }, []);
  
    // Fonction pour convertir l'heure en degrés
    function timeToDegrees(hour, minute) {
      const totalMinutes = hour * 60 + minute;
      return (totalMinutes / 1440) * 360; // 1440 minutes dans 24 heures
    }
  
    const currentHours = time.hours();
    const currentMinutes = time.minutes();
    const currentDegrees = timeToDegrees(currentHours, currentMinutes);
  
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
  
        {/* Repère fixe pour un événement solaire test */}
        <div className="marker" style={{ transform: `rotate(90deg)` }}>
          <div className="marker-label">Test</div>
        </div>
      </div>
    );
  }
  
  export default Clock2;
  