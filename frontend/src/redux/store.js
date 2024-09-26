import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk'; // Middleware pour gérer les actions asynchrones
import { sunTimesReducer } from './reducers/sunTimesReducer';

// Le store centralise tout l'état de l'application. Il utilise redux-thunk pour permettre les actions asynchrones comme les appels API.

// Combiner les reducers (pour des projets plus complexes)
const rootReducer = combineReducers({
  sunTimes: sunTimesReducer, // On peut ajouter d'autres reducers ici si nécessaire
});

// Création du store avec le reducer et le middleware
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
