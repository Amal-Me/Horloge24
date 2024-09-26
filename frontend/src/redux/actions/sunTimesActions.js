// Action pour récupérer les horaires solaires
import { getSunTimes } from '../../api/sunTimesApi'; // On importe l'appel API


// Fonction d'action asynchrone pour récupérer les données via l API et les dispatcher dans Redux
export const fetchSunTimes = (lat, lng) => async (dispatch) => {
  try {
    const data = await getSunTimes(lat, lng); // Appel API
    dispatch({ type: 'FETCH_SUN_TIMES_SUCCESS', payload: data }); // Envoie les données au reducer
  } catch (error) {
    dispatch({ type: 'FETCH_SUN_TIMES_ERROR', error }); // Envoie l'erreur si la requête échoue
  }
};
