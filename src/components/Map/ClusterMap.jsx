// Exemple React avec react-leaflet-cluster
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
//import 'react-leaflet-markercluster/dist/styles.min.css';
import L from 'leaflet';
import { Children } from 'react';

export default function ClusterMap({ points, Children }) {
  const center = [0.4069, 9.4686]; // par défaut Libreville

  return (
    <MapContainer center={center} zoom={12} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <MarkerClusterGroup chunkedLoading>
        {points.map((point) => (
            
          <Marker
            key={point._id}
            position={[point.latitude, point.longitude]}
            
            icon={new L.Icon({
              iconUrl: point.marqueur_id?.file ? `http://localhost:5000${point.marqueur_id.file}` : '/default.png',
              iconSize: [30, 30],
              iconAnchor: [15, 30],
            })}
          >
            <Popup>
              <strong>{point.name}</strong><br />
              {point.description}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      {Children}
    </MapContainer>
  );
}
