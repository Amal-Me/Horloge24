import React from 'react';
import Clock from './components/Clock';
import Header from './components/Header';
import SunTimes from './components/SunTimes';

function App() {
  return (
    <div className="App">
      <Header />        
       <main className="main-container">
       <SunTimes  /> 
        <Clock />
      </main>      
    </div>
  );
}

export default App;
