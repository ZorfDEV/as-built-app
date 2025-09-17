// Exemple React avec react-leaflet-cluster
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
//import 'react-leaflet-markercluster/dist/styles.min.css';
import L from 'leaflet';
//import { Children } from 'react';

export default function ClusterMap({ points, checkpoints,markers }) {
//  const center = [0.4069, 9.4686]; // par défaut Libreville

  if (checkpoints === false) {

    return (
      <MapContainer center={[points.latitude,points.longitude]} zoom={12} style={{ height: '400px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
           
              <Marker  position={[points.latitude, points.longitude]}>
                <Popup>{points.description}</Popup>

              </Marker>
          </MapContainer>
    );
  } 
  let mapCenter;
  if (points && points.length > 0) {
    mapCenter = [points[0].latitude, points[0].longitude];
  } else {
    mapCenter = [0.4069, 9.4686]; // par défaut Libreville
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={12}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

     <MarkerClusterGroup
  chunkedLoading
  iconCreateFunction={(cluster) => {
    const count = cluster.getChildCount();
    const sizeClass = count < 10
      ? 'w-8 h-8 text-xs'
      : count < 100
      ? 'w-10 h-10 text-sm'
      : 'w-12 h-12 text-base';

    const colorClass = count < 10
      ? 'bg-green-500'
      : count < 100
      ? 'bg-yellow-500'
      : 'bg-red-500';

    return L.divIcon({
      html: `
        <div class="tw-cluster ${sizeClass} ${colorClass}">
          <span>${count}</span>
        </div>`,
      className: '',
      iconSize: [0, 0], // pour éviter les conflits avec leaflet
    });
  }}
>

        {points && points.map(point => {
          const marker = markers && markers.length > 0
            ? markers.find(marker => marker._id === point.marqueur_id)
            : null;
            console.log('Marker:', marker);
            console.log('mark url:', `http://localhost:5000${marker.file}`);
          return (
            <Marker
              key={point._id}
              position={[point.latitude, point.longitude]}
              icon={new L.Icon({
                iconUrl: marker?.file ? `http://localhost:5000${marker.file}` : '/default.png',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
              })}
            >
              <Popup>
                <strong>{point.name}</strong><br />
                {point.description}
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
