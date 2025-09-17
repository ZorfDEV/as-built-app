export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => d * Math.PI/180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(2);
}

// utils/convertDMS.js
export function convertDMSToDecimal(dmsString) {
  // Si c'est déjà un nombre → retourne directement
  if (typeof dmsString === "number") return dmsString;
  if (!isNaN(Number(dmsString))) return Number(dmsString);

  // Nettoyage : retirer les espaces inutiles
  const str = dmsString.trim();

  // Regex : direction possible au début OU à la fin
  const regex = /([NSEW])?[:\s-]*?(\d{1,3})[°:\s]*(\d{1,2})?[′':\s]*(\d{1,2}(?:\.\d+)?)?[″"]?\s*([NSEW])?/i;
  const match = str.match(regex);

  if (!match) {
    console.warn("⚠️ Format non reconnu :", dmsString);
    return null;
  }

  // Groupes capturés
  let [, dir1, deg, min, sec, dir2] = match;

  const dir = dir1 || dir2; // direction trouvée avant OU après
  const degrees = parseInt(deg, 10) || 0;
  const minutes = parseInt(min, 10) || 0;
  const seconds = parseFloat(sec) || 0;

  // Conversion en décimal
  let decimal = degrees + minutes / 60 + seconds / 3600;

  // Appliquer signe en fonction de la direction
  if (dir && (dir.toUpperCase() === "S" || dir.toUpperCase() === "W")) {
    decimal = -decimal;
  }

  return decimal;
}

export function generateId(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

