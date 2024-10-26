// Fichier API pour faire les requêtes aux services externes (Sunrise-Sunset)
export const getSunTimes = async (lat, lng) => {
    const response = await fetch(`/api/sun-times?lat=${lat}&lng=${lng}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des horaires solaires');
    }
    return response.json(); // Renvoie les données pour les utiliser dans Redux
  };
 
