const initialState = {
  sunrise: '',
  sunset: '',
  solarNoon: '',  // Initialiser solarNoon
  civilTwilightBegin: '',  // Initialiser civilTwilightBegin
  civilTwilightEnd: '',  // Initialiser civilTwilightEnd
  error: null
};

export const sunTimesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_SUN_TIMES_SUCCESS':
      return {
        ...state,
        sunrise: action.payload.sunrise,
        sunset: action.payload.sunset,
        solarNoon: action.payload.solarNoon,  // Mise à jour du zénith
        civilTwilightBegin: action.payload.civilTwilightBegin,  // Mise à jour des premières lueurs
        civilTwilightEnd: action.payload.civilTwilightEnd,  // Mise à jour des dernières lueurs
        error: null
      };
    case 'FETCH_SUN_TIMES_ERROR':
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
};