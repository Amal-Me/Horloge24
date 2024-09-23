# Horloge Solaire Numérique

## 1. Objectif du projet

Développer une horloge numérique interactive basée sur un format de 24 heures, permettant de visualiser les moments clés de la journée solaire (lever du soleil, zénith, coucher du soleil). L'horloge intègre des dégradés visuels pour illustrer les différentes phases du jour et de la nuit, avec une ligne d’horizon ajustée en fonction des saisons. 

## 2. Fonctionnalités principales

### 2.1. Affichage de l'heure en temps réel
- Horloge en format 24 heures avec les heures fixes :
- Indications extérieures :
  - mi-nuit en bas
  - mi-di en haut
  - lever à gauche
  - coucher à droite
- Heures internes légèrement décalées sous le midi pour correspondre au zénith, variant selon la saison.
- Une seule aiguille indique l'heure selon les heures internes.

### 2.2. Phases du jour et de la nuit
- Couleurs en dégradé radial pour indiquer les différentes phases de la journée :
  - **Aube** : Bleu pâle à rose.  
    - Dégradé : `#E6E9F0` → `#FADADD`
  - **Zénith** : Jaune vif.  
    - Dégradé : `#FFFF00`
  - **Crépuscule** : Orange foncé à violet.  
    - Dégradé : `#FF4500` → `#800080`
  - **Nuit** : Bleu marine à noir.  
    - Dégradé : `#191970` → `#000000`

### 2.3. Ligne d'horizon dynamique
- Ligne d’horizon représentant le lever et coucher du soleil.
- La position de l’horizon varie en fonction de la saison, indiquant la longueur du jour et de la nuit.

### 2.4. Moments clés
- Marqueurs pour le lever du soleil, le zénith, et le coucher du soleil avec une ligne perpendiculaire de l'horizon vers le zénith.
- Possibilité d'afficher les horaires de prière islamiques associés à ces moments.

### 2.5. Affichage de la date
- Affichage de la date sur la ligne d'horizon.

## 3. Fonctionnalités secondaires

### 3.1. Intégration de la météo
- Affichage des conditions météorologiques actuelles (température, précipitations, etc.) via une API de météo (ex. : OpenWeatherMap).

### 3.2. Visualisation des solstices et équinoxes
- Indicateurs pour les solstices et équinoxes, avec ajustement de l’horizon pour représenter les variations saisonnières.

### 3.3. Notifications et intégration d’agenda (optionnel)
- Notifications pour des événements spécifiques (ex. : alarme pour un moment clé).
- Intégration d’agenda (Google Calendar, etc.).

## 4. Technologies

### 4.1. Front-end
- HTML, CSS, JavaScript.
- Utilisation de React.js pour la modularité et la réactivité.

### 4.2. Back-end
- Node.js pour la gestion des API.
- API Sunrise-Sunset pour récupérer les données de lever et coucher du soleil.
- API météo pour l'intégration des conditions météorologiques.

## 5. Design et UX

- Interface minimaliste et intuitive, adaptée aux écrans desktop et mobile.
- Palette de couleurs dynamique pour renforcer la compréhension visuelle.
- Réactivité pour une adaptation optimale aux différentes résolutions d’écran.

## 6. Évolution du projet

- Les fonctionnalités secondaires (météo, solstices, notifications) seront intégrées dans des itérations futures.
- L'intégration d'un agenda ou de notifications pourra être développée une fois les fonctionnalités principales validées.

## 7. Tests

- Tests unitaires sur les calculs horaires, l’affichage dynamique et la mise à jour en temps réel.
- Tests utilisateurs pour valider l'ergonomie et l’expérience utilisateur.
