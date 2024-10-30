import React from 'react';
import Clock from './components/Clock';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header />        
       <main className="main-container">
        <Clock />
      </main>      
    </div>
  );
}

export default App;
