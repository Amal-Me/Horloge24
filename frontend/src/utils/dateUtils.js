import { format, parseISO } from 'date-fns';

// Fonction pour formater une date en HH:mm
export const formatTime = (isoString) => {
  return format(parseISO(isoString), 'HH:mm');
};
