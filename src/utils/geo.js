export function haversineDistance(coordA, coordB) {
  const R = 6371e3;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(coordB.lat - coordA.lat);
  const dLon = toRad(coordB.lng - coordA.lng);
  const lat1 = toRad(coordA.lat);
  const lat2 = toRad(coordB.lat);

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // meters
}

export function formatDuration(seconds) {
  const mins = Math.round(seconds / 60);
  if (mins < 1) return `${Math.round(seconds)}s`;
  if (mins < 120) return `${mins} min`;
  const hours = (mins / 60).toFixed(1);
  return `${hours} hr`;
}
