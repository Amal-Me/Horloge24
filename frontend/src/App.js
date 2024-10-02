import React from 'react';
import SunTimes from './components/SunTimes';
import Clock from './components/Clock';

function App() {
  return (
    <div className="App">
      <SunTimes />
      <h1>Horloge 24 heures</h1>
      <Clock />
    </div>
  );
}

export default App;
