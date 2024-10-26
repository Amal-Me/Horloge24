import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSunTimes } from '../redux/actions/sunTimesActions';
import moment from 'moment-timezone'; //formatage et fuseaux horaires

//Ce composant utilise *useSelector* pour lire l'état de Redux et *useDispatch* pour
//envoyer des actions. Lorsqu'il obtient la géolocalisation de l'utilisateur,
//il déclenche l'action fetchSunTimes pour récupérer les horaires solaires via Redux.

function SunTimes() {
  const dispatch = useDispatch();
  // Récupération correcte de toutes les variables dans le state
  const { sunrise, sunset, solarNoon, civilTwilightBegin, civilTwilightEnd, error } = useSelector((state) => state.sunTimes); // On récupère l'état depuis Redux

  const [currentTime, setCurrentTime] = useState(moment().tz(moment.tz.guess()).format('HH:mm'));

  // Gérer la géolocalisation et dispatcher l'action pour récupérer les horaires
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(fetchSunTimes(latitude, longitude)); // On envoie les coordonnées à Redux
      },
      (error) => console.error('Erreur de géolocalisation :', error)
    );
  }, [dispatch]);

   // Mettre à jour l'heure actuelle toutes les minutes
   useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().tz(moment.tz.guess()).format('HH:mm'));
    }, 60000); // toutes les minutes

    return () => clearInterval(interval); // nettoyage de l'intervalle à la fin du cycle de vie
  }, []);

  // Détection automatique du fuseau horaire de l'utilisateur
  const userTimeZone = moment.tz.guess(); // Récupérer automatiquement le fuseau horaire

  // Ajout de logs pour s'assurer que les valeurs sont bien présentes
  console.log('Sunrise:', sunrise);
  console.log('SolarNoon:', solarNoon);
  console.log('Civil Twilight Begin:', civilTwilightBegin);

  
  // Conversion des heures UTC en heure locale
  const localSunrise = sunrise ? moment.utc(sunrise).tz(userTimeZone).format('HH:mm') : ''; // lever
  const localSunset = sunset ? moment.utc(sunset).tz(userTimeZone).format('HH:mm') : ''; // coucher
  const localSolarNoon = solarNoon ? moment.utc(solarNoon).tz(userTimeZone).format('HH:mm') : '';  // Zénith
  const localCivilTwilightBegin = civilTwilightBegin ? moment.utc(civilTwilightBegin).tz(userTimeZone).format('HH:mm') : '';  // Premières lueurs
  const localCivilTwilightEnd = civilTwilightEnd ? moment.utc(civilTwilightEnd).tz(userTimeZone).format('HH:mm') : '';  // Dernières lueurs

  // Affichage des données ou des erreurs
  if (error) {
    return <p>Erreur: {error.message}</p>;
  }

  return (
    <div>
      <h1>Horaires solaires</h1>
      <p>Heure actuelle : {currentTime}</p> {/* Ajout de l'heure actuelle */}
      <p>Premières lueurs : {localCivilTwilightBegin}</p>
      <p>Lever du soleil : {localSunrise}</p>
      <p>Zénith : {localSolarNoon}</p>
      <p>Coucher du soleil : {localSunset}</p>
      <p>Dernières lueurs : {localCivilTwilightEnd}</p>
    </div>
  );
}

export default SunTimes;
