// Action pour récupérer les horaires solaires
import { getSunTimes } from '../../api/sunTimesApi'; // On importe l'appel API


// Fonction d'action asynchrone pour récupérer les données via l API et les dispatcher dans Redux
export const fetchSunTimes = (lat, lng) => async (dispatch) => {
  try {
    const data = await getSunTimes(lat, lng); // Appel API depuis sunTimesApi.js, données déjà parsées
    console.log('Données API:', data); // Ajoute un log ici pour voir les données
    dispatch({ // envoi au reducer
      type: 'FETCH_SUN_TIMES_SUCCESS',
      payload: {
        sunrise: data.sunrise,
        sunset: data.sunset,
        solarNoon: data.solarNoon,              // Zénith
        civilTwilightBegin: data.civilTwilightBegin,  // Premières lueurs
        civilTwilightEnd: data.civilTwilightEnd       // Dernières lueurs
      }
    });
  } catch (error) {
    dispatch({ type: 'FETCH_SUN_TIMES_ERROR', error }); // envoi erreur
  }
};
