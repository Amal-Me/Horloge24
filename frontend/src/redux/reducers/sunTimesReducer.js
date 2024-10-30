// sunTimesReducer.js
const initialState = {
  sunrise: '',
  sunset: '',
  solarNoon: '',
  civilTwilightBegin: '',
  civilTwilightEnd: '',
  loading: false, // Ajout de l'état de chargement
  error: null
};

export const sunTimesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_SUN_TIMES_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_SUN_TIMES_SUCCESS':
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_SUN_TIMES_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};
