import React from 'react';
import './../Header.css'; 

const Header = () => {
  return (
    <header className="header-container">
      {/* logo ou titre stylisé */}
      <div className="logo">
        <img src="/SolarTimeLogo.svg" alt="SolarTime Logo" /> {/* Remplace par le vrai chemin de ton logo */}
        
      </div>
      {/* Menu de navigation */}
      <nav className="navigation">
        <ul>
          <li><a href="#horloge">Horloge</a></li>
          <li><a href="#meteo">Météo</a></li>
          <li><a href="#localisation">Localisation</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
