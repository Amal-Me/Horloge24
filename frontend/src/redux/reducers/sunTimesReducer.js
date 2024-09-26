// Initial state pour les horaires solaires
//Lever du soleil : {sunrise}
//Coucher du soleil : {sunset}

const initialState = {
    sunrise: '',
    sunset: '',
    error: null,
  };
  
  // Le reducer gère les actions et met à jour l'état
  export const sunTimesReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_SUN_TIMES_SUCCESS':
        return {
          ...state,
          sunrise: action.payload.sunrise,
          sunset: action.payload.sunset,
        };
      case 'FETCH_SUN_TIMES_ERROR':
        return {
          ...state,
          error: action.error,
        };
      default:
        return state; // Si l'action ne correspond pas, on renvoie l'état inchangé
    }
  };
  