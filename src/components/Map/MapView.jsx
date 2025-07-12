import { useRef,useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup,Tooltip, Polyline , LayersControl} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import axios from 'axios';
import toast from 'react-hot-toast';
import ButtonForm from '../ui/ButtonForm'; // Assurez-vous que le chemin est correct
import { MdOutlineSettingsEthernet } from "react-icons/md";
import Input from '../ui/Input'; // Assurez-vous que le chemin est correct
import ClusterMap from './ClusterMap';
import 'leaflet/dist/leaflet.css';
import { haversineDistance,convertDMSToDecimal } from '../../utils/distance';


export default function MapView() {
  const [points, setPoints] = useState([]);
 const [center, setCenter] = useState([0.4069071, 9.4686676]); 
 //const center = [0.4069, 9.4686]; 
  const [loading, setLoading] = useState(true);
  const [pointAName, setPointAName] = useState('');
  const [pointBName, setPointBName] = useState('');
  const [routeCoords, setRouteCoords] = useState([]);
  const [duration, setDuration] = useState(null);
  //const [routeDistance, setRouteDistance] = useState(null);
 const [distance, setDistance] = useState(null);
  const mapRef = useRef();
  const [showForm, setShowForm] = useState(false);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [mapReady, setMapReady] = useState(false);
const [addedPoint, setAddedPoint] = useState(null);
  const [lib, setLib] = useState('');

const  handleAddPoint = () => {
    setShowForm(!showForm);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const map = mapRef.current;
  console.log('mapRef:', mapRef.current);
  console.log('mapReady:', mapReady);

  const latNum = convertDMSToDecimal(lat);
  const lngNum = convertDMSToDecimal(lng);

  console.log('Valeurs saisies:', { lat: latNum, lng: lngNum });


  if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
    toast.error("Coordonnées invalides");
    return;
  }
  const pointData = {
      name:lib,
      description: `Point de coupure ${latNum.toFixed(5)}, ${lngNum.toFixed(5)}`,
      latitude: latNum,
      longitude: lngNum,
      section_id:'6853372f52f53788e058056a',
      marqueur_id: '68331bd8c567b12828fc1066', 
    };

    try {
      await axios.post('http://localhost:5000/api/points', pointData);
      console.log('Point ajouté avec succès', pointData);
      toast.success('Point ajouté avec succès');
      e.target.reset(); 
    } catch {
      console.log('Erreur ajout point', pointData);
      toast.error("Erreur lors de l'ajout du point");
    }

  // centrage + ajout du marker
  map.setView([latNum, lngNum], 15);
  setAddedPoint({ lat: latNum, lng: lngNum });
  setShowForm(false);
setCenter([latNum, lngNum]);
  console.log('Nouveau point ajouté:', { lat: latNum, lng: lngNum });
};


  const redIcon = new L.Icon({
    iconUrl: 'http://localhost:5000/uploads/ic-markers/file-1748179928428-572680519.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const ORS_API_KEY = '5b3ce3597851110001cf6248d10b88622627a47934615c52671cfb8959a9befa537aa376f8adc900'; // Remplacez par votre clé API ORS

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/points');
        setPoints(res.data);

      /*  if (res.data.length === 0 && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
            setCenter([pos.coords.latitude, pos.coords.longitude]);
          });
        } else {
          const first = res.data[0];
          setCenter([first.latitude, first.longitude]);
        }*/
      } catch (err) {
        console.error('Erreur API carte:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

 const getCoordinates = (name) => {
    const point = points.find(p => p.name === name);
    return point ? [point.longitude, point.latitude] : null;
  };

  const handleRoute = async () => {
    const coordsA = getCoordinates(pointAName);
    const coordsB = getCoordinates(pointBName);
    console.log('Coordonnées A:', coordsA);
    console.log('Coordonnées B:', coordsB);

  if (!coordsA || !coordsB) {
      toast.error('Veuillez saisir des noms de points valides.');
      return;
    }
setRouteCoords([
  [coordsA[1], coordsA[0]],
  [coordsB[1], coordsB[0]]
]);

// calcul distance haversine
const [lonA, latA] = coordsA;
const [lonB, latB] = coordsB;
 setDistance(haversineDistance(latA, lonA, latB, lonB));

    setDuration(null); // Réinitialiser la durée avant de faire la requête
    /*  try {
      const response = await axios.post(
  'https://api.openrouteservice.org/v2/directions/driving-car',
  {
    coordinates: [coordsA, coordsB]
  },
  {
    headers: {
      'Authorization': ORS_API_KEY,
      'Content-Type': 'application/json'
    }
  }
);

     // const geometry = response.data.geometry;
      const geometry = response.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      const distanceMeters = response.data.routes[0].summary.distance;
      setDistance((distanceMeters / 1000).toFixed(2)); // Convertir en kilomètres
      const durationSeconds = response.data.routes[0].summary.duration;
       setDuration((durationSeconds / 60).toFixed(1)); // Convertir en minutes
      //const encodedGeometry = response.data.routes[0].geometry;
      const encodedGeometry = geometry;
      const decoded = polyline.decode(encodedGeometry)
      setRouteCoords(decoded.map(([lat, lng]) => [lng, lat])); // Inverser l'ordre pour Leaflet
      //const decodedCoords = L.Polyline.fromEncoded(encodedGeometry).getLatLngs().map(latlng => [latlng.lng, latlng.lat]);

    } catch (error) {
      console.error('Erreur lors de la récupération de l\'itinéraire:', error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : error.message);
      //setRouteCoords([]);
      toast.error('Erreur lors de la récupération de l\'itinéraire.');
    }*/

  };

  const handleReset = () => {
    setPointAName('');
    setPointBName('');
    setRouteCoords([]);
    setDistance(null);
    setDuration(null);
  };

 const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

 

  if (loading){ 
  // Afficher un indicateur de chargement
  //setMapReady(true);
    return <div className='items-center justify-center bg-white z-1000 absolute top-60 rounded shadow'><ButtonForm isLoading >Chargement...</ButtonForm></div>;
}
  return (
    <div className="h-full w-full">
     <div className=" absolute top-1 left-[350px] z-1000">
  <div className="relative mt-2">
    <button onClick={toggleMenu} type="button" className="grid w-full  grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-1 cursor-pointer focus:outline-green-600 sm:text-sm/6" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
      <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
        <span className="block truncate">Calculer une distance</span>
      </span>
      <MdOutlineSettingsEthernet className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
    </button>
        <div className="flex items-center">
           {openMenu && (
                <div className=" mb-10 bg-white z-1000 absolute top-10 rounded shadow">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-3 p-3">
                    <Input name='pointAName' type="text" value={pointAName} onChange={e => setPointAName(e.target.value)} className=" w-full px-1 py-1.5" label='Point A' required />
                    <Input name='pointBName' type="text" value={pointBName} onChange={e => setPointBName(e.target.value)} className="border px-1 py-1.5 rounded w-full" label='Point B' required/>
                  <div className="flex justify-between pt-2">
                  <button onClick={handleReset} className="bg-gray-500 cursor-pointer text-white text-sm  px-2 py-2 rounded-md hover:bg-gray-700">annuler</button>
                  <button onClick={handleRoute} className="bg-green-500 hover:bg-green-700 cursor-pointer text-white px-2 py-2 text-sm rounded-md">Calculer</button>
                   </div>
                  </div>
                  <div className=" m-3">
                  {distance && <p className=' m-2 text-xs text-gray-500 font-bold '>Distance:  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                    {distance} km</span></p>} 
                  {duration && <p  className=' m-2 text-xs font-bold text-gray-500'>Durée: <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                  {duration} minutes</span></p>}
                </div>
                </div>
                )}
        </div>
        
      </div>
      <div className=" mt-2 flex items-center justify-between ml-20">
         <button
        onClick={handleAddPoint}
        className=" bg-green-600 text-white px-4 py-2 rounded shadow"
      >
        Ajouter un point
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className=" bg-white p-4 rounded shadow items-center justify-center">
          <h3 className="text-sm text-center font-semibold mb-2">Ajouter un point</h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-3 p-3">
          <Input name='libele' type="text" label="Libelé" className=" w-full px-1 py-1.5" value={lat} onChange={e => setLib(e.target.value)} required />
         <Input name='latitude' type="text" label="Latitude" className=" w-full px-1 py-1.5" value={lat} onChange={e => setLat(e.target.value)} required />
          <Input name='longitude' type="text" label="Longitude" className=" w-full px-1 py-1.5" value={lng} onChange={e => setLng(e.target.value)} required />
          <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-700 cursor-pointer">Valider</button>
          </div>
        </form>
      )}
      </div>
    </div>
   <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}
   ref={mapRef}
   whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          setMapReady(true);  // carte prête
        }}>
    <LayersControl position="topright">
  <LayersControl.BaseLayer checked name="Plan standard">
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  </LayersControl.BaseLayer>
  <LayersControl.BaseLayer name="Satellite">
    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
  </LayersControl.BaseLayer>
</LayersControl>


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
      {addedPoint && (
          <Marker position={[addedPoint.lat, addedPoint.lng]} icon={redIcon}>
            <Tooltip permanent>
              <span>{lib}</span>
            </Tooltip>
            <Popup>
              <strong>Point incident OMSI</strong><br />
            </Popup>
          </Marker>
        )}
      {routeCoords.length > 0 && (
        <Polyline
          positions={routeCoords} // Inverser l'ordre pour Leaflet
          color="blue"
          weight={4}
        >
          <Tooltip>
            <span>Distance: {distance} km</span><br />
            <span>Durée: {duration} minutes</span>
          </Tooltip>
        </Polyline>
      )}
    </MapContainer> 
       
    </div>
  );
}