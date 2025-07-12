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
 const regex = /(\d{1,3})[°:\s]*(\d{1,2})[′':\s]*(\d{1,2}(?:\.\d+)?)[″"]?\s*([NSEW])/i;
  const match = dmsString.match(regex);

  if (!match) return null;

  const [, deg, min, sec, dir] = match;
  const decimal = parseInt(deg) + parseInt(min) / 60 + parseFloat(sec) / 3600;

  if (dir === 'S' || dir === 'W') return -decimal;
  return decimal;
  };

