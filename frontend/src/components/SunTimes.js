import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSunTimes } from '../redux/actions/sunTimesActions';
import moment from 'moment-timezone'; //formatage et fuseaux horaires

//Ce composant utilise *useSelector* pour lire l'état de Redux et *useDispatch* pour
//envoyer des actions. Lorsqu'il obtient la géolocalisation de l'utilisateur,
//il déclenche l'action fetchSunTimes pour récupérer les horaires solaires via Redux.

function SunTimes() {
  const dispatch = useDispatch();
  const { sunrise, sunset, error } = useSelector((state) => state.sunTimes); // On récupère l'état depuis Redux

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

  // Détection automatique du fuseau horaire de l'utilisateur
  const userTimeZone = moment.tz.guess(); // Récupérer automatiquement le fuseau horaire
  
  // Conversion des heures UTC en heure locale
  const localSunrise = sunrise ? moment.utc(sunrise).tz(userTimeZone).format('HH:mm') : '';
  const localSunset = sunset ? moment.utc(sunset).tz(userTimeZone).format('HH:mm') : '';

  // Affichage des données ou des erreurs
  if (error) {
    return <p>Erreur: {error.message}</p>;
  }

  return (
    <div>
      <h1>Horaires solaires</h1>
      <p>Lever du soleil : {localSunrise}</p>
      <p>Coucher du soleil : {localSunset}</p>
    </div>
  );
}

export default SunTimes;
