import { useRef,useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup,Tooltip, Polyline , LayersControl} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import axios from 'axios';
import toast from 'react-hot-toast';
import ButtonForm from '../ui/ButtonForm'; 
import Cardata from '../ui/Cardata';
import SearchBar from './SearchBar';
import { MdOutlineSettingsEthernet,MdShare } from "react-icons/md";
import Input from '../ui/Input';
import ClusterMap from './ClusterMap';
import CustomZoomControl from './CustomZoomControl';
import 'leaflet/dist/leaflet.css';
import { haversineDistance,convertDMSToDecimal,generateId } from '../../utils/distance';
import { RiMapPinAddFill,RiPinDistanceFill } from "react-icons/ri";
import { useOutletContext, useNavigate } from 'react-router-dom';
import InputSelect from '../ui/InputSelect';
import { useAuth } from '../../contexts/AuthContext';
import { RiScissorsCutLine } from "react-icons/ri";
import { TiArrowMaximise } from "react-icons/ti";
import { FiEye} from 'react-icons/fi'
import Spinner from '../ui/Spinner';
import { GeoJSON } from 'react-leaflet';


export default function MapView({ header, isOpen }) {

  const { darkMode} = useOutletContext();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [points, setPoints] = useState([]);
  const [center, setCenter] = useState([-0.602957760686725, 11.912091195294634
]); 
const [gabonBorders, setGabonBorders] = useState(null);

  const [loading, setLoading] = useState(true);
  const [pointAName, setPointAName] = useState('');
  const [pointBName, setPointBName] = useState('');
  const [routeCoords, setRouteCoords] = useState([]);
  const [duration, setDuration] = useState(null);
  const [distance, setDistance] = useState(null);
  const mapRef = useRef();
  const [showForm, setShowForm] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [addedPoint, setAddedPoint] = useState(null);
  const [sections, setSections] = useState([]); 
  const [activeLayer, setActiveLayer] = useState(darkMode ? "satellite" : "standard");
  const [piName, setPiName] = useState(null);
  const [boundsFitted, setBoundsFitted] = useState(false);
const [bounds, setBounds] = useState(null);

  // chargement des frontières du Gabon
  useEffect(() => {
  const loadBorders = async () => {
    try {
      const res = await axios.get('/datas/ga.geojson');
      setGabonBorders(res.data);
       // Création des limites à partir du GeoJSON
        const layer = L.geoJSON(res.data);
        const geoBounds = layer.getBounds();
        setBounds(geoBounds);

        // Appliquer fitBounds une fois la carte prête
        if (mapRef.current) {
          mapRef.current.fitBounds(geoBounds);
          mapRef.current.setMaxBounds(geoBounds);
        }
    } catch (err) {
      console.error("Erreur lors du chargement des frontières du Gabon :", err);
    }
  };
  loadBorders();
}, []);


  // Mise à jour du calque actif en fonction du mode sombre
 useEffect(() => {
    setActiveLayer(darkMode ? "satellite" : "standard");
  }, [darkMode]);


const  handleAddPoint = () => {
    setShowForm(!showForm);
  };
  
//creation point incident
 const handleSubmit = async (e) => {
  e.preventDefault();
  const map = mapRef.current;
  console.log('mapRef:', mapRef.current);
  console.log('mapReady:', mapReady);
  const formData = new FormData(e.target);
   const uniqueId = generateId(5);
  const pointName = `Point-incident-${uniqueId}`;
 // récupère séparément latitude et longitude
  const latDMS = formData.get('latitude').trim();
  const lonDMS = formData.get('longitude').trim();

  const latitudeconv = convertDMSToDecimal(latDMS);
  const longitudeconv = convertDMSToDecimal(lonDMS);
  //console.log('Valeurs saisies:', { lat: latitudeconv, lng: longitudeconv });
  if (isNaN(latitudeconv) || isNaN(longitudeconv) || latitudeconv < -90 || latitudeconv > 90 || longitudeconv < -180 || longitudeconv > 180) {
    toast.error("Coordonnées invalides");
    return;
  }
  const pointData = {
      name: pointName,
      description: `${pointName} ajouté le ${new Date().toLocaleDateString()}`,
      latitude: latitudeconv,
      longitude: longitudeconv,
      section_id: formData.get('section_id'),
      marqueur_id: '68331bd8c567b12828fc1066',
      user_id: user.id
    };

    try {
      await axios.post('/api/points/pointsincident', pointData, { headers: header });
      console.log('Point ajouté avec succès', pointData);
      toast.success('Point ajouté avec succès');
      setPiName(pointData.name);
      e.target.reset();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du point', error);
      console.log('Erreur datas send', pointData);

      toast.error("Erreur lors de l'ajout du point");
    }

// centrage + ajout du marker
map.setView([latitudeconv, longitudeconv], 15);
setAddedPoint({ lat: latitudeconv, lng: longitudeconv });
setShowForm(false);
setCenter([latitudeconv, longitudeconv]);
//console.log('Nouveau point ajouté:', { lat: latitudeconv, lng: longitudeconv });
};
  const redIcon = new L.Icon({
    iconUrl: '/api/uploads/ic-markers/file-1748179928428-572680519.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
 //  votre clé API ORS
  const ORS_API_KEY = '5b3ce3597851110001cf6248d10b88622627a47934615c52671cfb8959a9befa537aa376f8adc900'; 
 
 // Récupération de tous les points
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await axios.get('/api/points/map', { headers: header });
        setPoints(res.data);
        console.log('Points récupérés:', res.data);
      } catch (err) {
        console.error('Erreur API carte:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  const interval = setInterval(fetchPoints, 20000);
  return () => clearInterval(interval);
  }, [header]);

 const getCoordinates = (name) => {
    const point = points.find(p => p.name === name);
    return point ? [point.longitude, point.latitude] : null;
  };

  //Trace route
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

    setDuration(null); 
  };
//chargement des sections
    useEffect(() => {
    axios.get('/api/sections', { headers: header }).then(res => {
      setSections(res.data);
      console.log('Sections:', res.data);
    });
  }, [header]);



 const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

 

  if (loading){ 
  // Afficher un indicateur de chargement
  //setMapReady(true);
    return <div className='flexitems-center justify-center bg-white z-1000  top-60 rounded shadow'><Spinner /></div>;
}
  return (
  <div className="h-full w-full">
      <div className={`absolute top-1  ${isOpen ? "left-[200px]":"left-[200px]"}  z-1000`}>
        <div className=' mt-20 flex-col space-y-12 sm:flex-row'>
        <div className='relative group'>
        <ButtonForm 
        onClick={toggleMenu}
         type="button"
         variant='success'
         icon={<TiArrowMaximise/>}
         className="grid w-full    grid-cols-1  py-1.5 pr-2 pl-3   cursor-pointer">
          <span className='text-sm ml-2'>Itinéraire</span>
        </ButtonForm>
        <span className="absolute shadow-md  rounded-md w-0 p-0 group-hover:w-fit group-hover:p-2 group-hover:mt-1 bg-white overflow-hidden duration-300">Cal.distance</span>
        </div>
        <div className='relative group ml-2'>
        <ButtonForm
          onClick={handleAddPoint}
          variant='success'
          icon={<RiScissorsCutLine />}
          iconSize='sm'
          type="button"
          className=" grid w-full grid-cols-1 cursor-pointer">
            <span className='text-sm ml-2'>Incident</span>
        </ButtonForm>
        <span className="absolute shadow-md  rounded-md w-0 p-0 group-hover:w-fit group-hover:p-2 group-hover:mt-1 bg-white overflow-hidden duration-300">Ajouter.PI</span>
        </div>
        </div>
        {showForm && (
          <div className="fixed inset-0 z-[9000]  bg-gray-900 transition-opacity duration-300 ease-in-out opacity-90 flex items-center justify-center">
            <Cardata
              title="Ajouter un point"
              headerAction={
              <span class="relative flex size-3 cursor-pointer"  onClick={() => setShowForm(false)}>
  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
  <span class="relative inline-flex  items-center justify-center text-[8px] text-white p-1 size-3 rounded-full bg-red-500">x</span>
</span>
              }
            >
              <form onSubmit={handleSubmit} className="p-4 items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3 p-3">
                  <InputSelect name="section_id" label="Section"  required className='p-2 px-2'
                              datas={sections} />
                  <Input name='latitude' type="text" label="Latitude" className=" w-full px-1 py-1.5"  required />
                  <Input name='longitude' type="text" label="Longitude" className=" w-full px-1 py-1.5"  required />
                  <button type="submit" className="bg-brandgreen text-white px-2 py-1 rounded-md hover:bg-brandblue hover:text-brandgreen shadow-md cursor-pointer">Valider</button>
                </div>
              </form>
            </Cardata>
          </div>
        )}
         {openMenu && (
         <div className="fixed inset-0 z-[9000]  bg-gray-900 transition-opacity duration-300 ease-in-out opacity-90 flex items-center justify-center">
            <Cardata
              title="Calcul dedistance"
              headerAction={
               <span class="relative flex size-3 cursor-pointer"  onClick={() => setOpenMenu(false)}>
  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
  <span class="relative inline-flex  items-center justify-center text-[8px] text-white p-1 size-3 rounded-full bg-red-500">x</span>
</span>
              }
            >
            <div className="grid grid-cols-1 md:grid-cols-1 gap-3 p-3">
              <Input name='pointAName' type="text" value={pointAName} onChange={e => setPointAName(e.target.value)} className=" w-full px-1 py-1.5" label='Point A' required />
              <Input name='pointBName' type="text" value={pointBName} onChange={e => setPointBName(e.target.value)} className="border px-1 py-1.5 rounded w-full" label='Point B' required/>
              <button type="submit" onClick={handleRoute} className="bg-brandgreen text-white px-2 py-1 rounded-md hover:bg-brandblue hover:text-brandgreen shadow-md cursor-pointer">Valider</button>
            </div>
            <div className=" m-3">
              {distance && <p className=' m-2 text-xs text-gray-500 font-bold '>Distance:  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                {distance} km</span></p>} 
              {duration && <p  className=' m-2 text-xs font-bold text-gray-500'>Durée: <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                {duration} minutes</span></p>}
            </div>
            </Cardata>
          </div>
          
        )}
      </div>
      <MapContainer 
      center={center}
       zoom={7}
        maxBounds={bounds}
        maxBoundsViscosity={1.0} // 1.0 = impossible de sortir de la zone
       zoomControl={false}
       style={{ height: '100%', width: '100%' }}
       ref={mapRef}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          setMapReady(true);  // carte prête
        }}>
      <SearchBar points={points} />
    <CustomZoomControl />
    <LayersControl position="topright">
  <LayersControl.BaseLayer checked={activeLayer === "standard"} name="Plan standard">
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  </LayersControl.BaseLayer>
  <LayersControl.BaseLayer checked={activeLayer === "satellite"} name="Satellite">
    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
  </LayersControl.BaseLayer>
</LayersControl>
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
      : 'bg-blue-500';

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
        {points.map((point) => (
            
          <Marker
            key={point._id}
            position={[point.latitude, point.longitude]}
            
            icon={new L.Icon({
              iconUrl: point.marqueur_id?.file ? `/api${point.marqueur_id.file}` : '/default.png',
              iconSize: [30, 30],
              iconAnchor: [15, 30],
            })}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
              <span className="text-xs font-semibold">{point.name}</span> 
            </Tooltip>
            <Popup>
              <span className="text-xs text-gray-500">{point.description}</span><br />
              <div className='flex items-center  space-x-4'>
                <div className='flex-1'>
                  <button className="mt-2 bg-[#00AED1] text-white text-xs px-2 py-1 cursor-pointer rounded hover:bg-blue-700 " onClick={() => { navigate(`/dashboard/point/view/${point._id}`); }}>
                    <FiEye/>
                  </button>
                </div>
                <div className="flex-1">
              <button
        onClick={() => {
      const shareLink = `https://maps.google.com?q=${point.latitude},${point.longitude}`;
      navigator.clipboard.writeText(shareLink);
      toast.success("Lien copié dans le presse-papier !");
    }}
    className="mt-2 bg-brandgreen text-white text-xs px-2 py-1 cursor-pointer rounded hover:bg-blue-700"
  >
    <MdShare /> 
  </button>
  </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      {addedPoint && (
          <Marker position={[addedPoint.lat, addedPoint.lng]} icon={redIcon}>
            <Tooltip permanent>
              <span>{piName}</span>
            </Tooltip>
            <Popup>
              <strong>{piName}</strong><br />
            </Popup>
          </Marker>
        )}
      {routeCoords.length > 0 && (
        <Polyline
          positions={routeCoords} // Inverser l'ordre pour Leaflet
          color="red"
          weight={4}
        >
          <Tooltip>
            <span>Distance: {distance} km</span><br />
            <span>Durée: {duration} minutes</span>
          </Tooltip>
          <Popup>
              <strong>{distance} km</strong><br />
            </Popup>
        </Polyline>
      )}
     {gabonBorders && (
  <GeoJSON
    data={gabonBorders}
    style={{
      color: "#BFBFBF",
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.05,
    }}
   onEachFeature={(_, layer) => {
  if (!boundsFitted && mapRef.current) {
    mapRef.current.fitBounds(layer.getBounds());
    setBoundsFitted(true);
  }
}}
  />
)}

    </MapContainer> 
  </div>
  );
}