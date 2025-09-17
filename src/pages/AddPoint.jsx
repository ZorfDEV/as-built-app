import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Input from './../components/ui/Input';
import InputSelect from './../components/ui/InputSelect';
import Textarea from './../components/ui/Textarea';
import Cardata from './../components/ui/Cardata';
import ButtonForm from './../components/ui/ButtonForm';
import ButtonContainer from './../components/ui/ButtonContainer';
import toast from 'react-hot-toast';
import { MdAttachFile } from "react-icons/md";
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import SwitchMode from './../components/ui/SwitchMode'; // Assurez-vous que le chemin est correct
import { useAuth } from './../contexts/AuthContext'; // Ajout de l'import du hook useAuth
import { convertDMSToDecimal } from './../utils/distance';

export default function AddPoint() {

  const [tab, setTab] = useState('Saisie');
  const [sections, setSections] = useState([]);
  const [marqueurs, setMarqueurs] = useState([]);
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [excelPreview, setExcelPreview] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

   const token = localStorage.getItem('token');
      const headers = useMemo(() => ({
              Authorization: `Bearer ${token}`
           }), [token]);

  useEffect(() => {
    axios.get('/api/sections',{headers}).then(res => {
      setSections(res.data);
      console.log('Sections:', res.data);
    });
    axios.get('/api/marqueurs', { headers }).then(res => {
      setMarqueurs(res.data);
      console.log('Marqueurs:', res.data);
    });
  }, [headers]);

const handleSubmitForm = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  // récupère séparément latitude et longitude
  const latDMS = formData.get('latitude').trim();
  const lonDMS = formData.get('longitude').trim();

  const latitudeconv = convertDMSToDecimal(latDMS);
  const longitudeconv = convertDMSToDecimal(lonDMS);

  if (latitudeconv == null || longitudeconv == null) {
    toast.error('Coordonnées invalides');
    console.log('Coordonnées invalides:', latDMS, lonDMS);
    return;
  }

  console.log('Latitude:', latitudeconv, 'Longitude:', longitudeconv);

   const pointData = {
      name: formData.get('name'),
      //nature: formData.get('nature'),
      description: formData.get('description'),
      latitude: latitudeconv,
      longitude: longitudeconv,
      section_id: formData.get('section_id'),
      marqueur_id: formData.get('marqueur_id'),
      nature: 'pt-asbuilt',
      user_id: user.id, 
      status: 'inactive'
    };

    try {
      await axios.post('/api/points', pointData,{headers});
      console.log('Point ajouté avec succès', pointData);
      toast.success('Point ajouté avec succès');
      e.target.reset(); 
    } catch {
      console.log('Erreur ajout point', pointData);
      toast.error("Erreur lors de l'ajout du point");
    }
  };

  // Fonction pour convertir les coordonnées DMS en décimal
  const convertDMS = (dmsString) => {
  if (!dmsString) return null;
  // Expression régulière améliorée pour gérer les secondes décimales
  const regex = /([NSWE]):\s*(\d{1,3})[°:\s]*(\d{1,2})[′':\s]*(\d{1,2}(?:\.\d+)?)[″"]?/gi;
  const matches = [...dmsString.matchAll(regex)];
  let lat = null, lng = null;

  for (const match of matches) {
    const [, dir, deg, min, sec] = match;
    const decimal = parseInt(deg) + parseInt(min) / 60 + parseFloat(sec) / 3600;
    if (dir === 'S') lat = -decimal;
    else if (dir === 'N') lat = decimal;
    else if (dir === 'W') lng = -decimal;
    else if (dir === 'E') lng = decimal;
  }

  return { lat, lng };
};

  // Fonction pour lire le fichier Excel et prévisualiser les données
  // Elle vérifie les colonnes requises et convertit les coordonnées DMS si nécessaire
const handleExcelRead = (e) => {
  const f = e.target.files[0];
  setFile(f);

  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (raw.length === 0) {
      toast.success('Fichier vide');
      alert('Fichier vide');
      setExcelPreview([]);
      return;
    }

    const requiredCols = ['name', 'latitude', 'longitude', 'description','section_id', 'marqueur_id'];
    const fileCols = Object.keys(raw[0]).map(c => c.toLowerCase().trim());
const missing = requiredCols.filter(col => !fileCols.includes(col));
    if (missing.length > 0) {
      toast.error(`Colonnes manquantes : ${missing.join(', ')}`);
      setExcelPreview([]);
      return;
    }

    const validated = raw.map((row) => {
      let lat = row.latitude ? row.latitude.trim() : '';
      let lng = row.longitude ? row.longitude.trim() : '';

      console.log('Ligne lue:', row);
      console.log('Latitude:', lat, 'Longitude:', lng);

      // Si ce n'est pas un nombre, on tente la conversion DMS
      if (isNaN(lat) || isNaN(lng)) {
        const converted = convertDMS(`${lat}, ${lng}`);
        console.log('Coordonnées converties:', converted);
        if (!converted || isNaN(converted.lat) || isNaN(converted.lng)) return null;
        lat = converted.lat;
        lng = converted.lng;
      }
      if (isNaN(lat) || isNaN(lng)) {
        console.error('Coordonnées invalides pour la ligne:', row);
        return null;
  }
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

      return {
        ...row,
        latitude: lat,
        longitude: lng
      };
    }).filter(p => p && !isNaN(p.latitude) && !isNaN(p.longitude));

    if (validated.length === 0) {
      toast.error('Aucun point valide trouvé');
    }

    setExcelPreview(validated);
    setCurrentPage(1);
  };
  reader.readAsArrayBuffer(f);
}; 

  // Fonction pour gérer l'upload du fichier Excel
  // Elle envoie les données au backend pour traitement
  const handleUploadExcel = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await axios.post('http://localhost:5000/upload/xlsx', formData);
      toast.success('Fichier importé avec succès');
      handleResetFile();
    } catch {
      toast.error('Erreur upload Excel');
      console.log(Object.fromEntries(formData));
    }
  };

  const handleResetFile = () => {
    setFile(null);
    setExcelPreview([]);
    //toast.success('fichier effacer');
  };

  const totalPages = Math.ceil(excelPreview.length / rowsPerPage);
  const currentRows = excelPreview.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}>
      <Cardata title={tab === 'Saisie' ? 'Ajouter un point' : 'Importer'}
        subtitle={tab === 'Saisie' ? 'Formulaire d’ajout de point' : 'Importer des points depuis un fichier Excel'}
        className="p-6 bg-white dark:bg-gray-800 shadow-md items-center w-full max-w-3xl mx-auto"
        noPadding headerAction= {<SwitchMode onToggle={(value) => setTab(value) } />}> 
      {tab === 'Saisie' && (
        <form onSubmit={handleSubmitForm} >

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-6">

          <Input name="name" label="Nom" required className='p-2 px-2'/> 
         
           </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 p-6">
          <Input name="latitude"  label="Latitude"  required className='p-2 px-2'/>
          <Input name="longitude" label="Longitude"   required className='p-2 px-2'/>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 p-6">
          <InputSelect name="section_id" label="Section"  required className='p-2 px-2'
            datas={sections} />
          <InputSelect name="marqueur_id" label="Marqueur"  required className='p-2 px-2'
            datas={marqueurs} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-6">
          <Textarea name="description" label="Description" required className='p-2 px-2' />
          </div>
          <ButtonContainer className="flex mt-6 w-full">
                          <ButtonForm
                            type="button"
                             className="bg-gray-400 flex justify-center text-white w-full py-2 rounded hover:bg-gray-600 hover:scale-105 duration-300 transition ease-in "
                          >
                            Annuler
                          </ButtonForm>
                          <ButtonForm
                            type="submit"
                           className="bg-brandgreen text-white py-2 w-full transition ease-in rounded hover:bg-brandblue hover:scale-105 duration-300  hover:text-brandgreen justify-center"
                
                          >
                            Ajouter
                          </ButtonForm>
                        </ButtonContainer>
        </form>
      )}

      {tab === 'Importer' && (
        <form onSubmit={handleUploadExcel} className=" flex flex-col items-center">
          
          
          <div className="col-span-full">
          <div className="mt-2 flex justify-center rounded-lg  border-dashed
           border-gray-900/25 px-6 py-10 dark:border-darkborder border-2 hover:border-brandgreen hover:scale-105 hover:text-brandgreen duration-300 transition ease-in w-full">
                <div className="text-center">
                  <MdAttachFile aria-hidden="true" className="mx-auto size-12 text-gray-300"/>
                  <div className="mt-4 flex text-sm/6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md  font-semibold text-brandblue focus-within:ring-2 focus-within:ring-brandblue focus-within:ring-offset-2 focus-within:outline-hidden hover:text-brandgreen dark:text-darktext-primary"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file"  accept=".xlsx" onChange={handleExcelRead} type="file" className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs/5 text-gray-600 dark:text-darktext-secondary">xlsx, up to 10MB</p>
                </div>
              </div>
            </div>
        <ButtonContainer className="flex mt-6 w-full justify-center">
          {file && (
                          <ButtonForm
                            type="button"
                            
                            className="bg-gray-400 text-white font-semibold w-[100px] py-2 rounded hover:bg-red-500 transition duration-300 ease-in  hover:scale-105"
                          >
                            <span onClick={handleResetFile}>Supprimer</span>
                          </ButtonForm>
                           )}
                          <ButtonForm
                            type="submit"
                            className="bg-brandgreen text-brandblue py-2 w-[100px] transition duration-300 ease-in rounded hover:bg-brandblue hover:scale-105  hover:text-brandgreen justify-center font-semibold"
                          >
                            Importer
                          </ButtonForm>
                        </ButtonContainer>

          <p className="text-sm text-gray-500 mt-2 dark:text-darktext-primary">Fichier sélectionné : {file ? file.name : 'Aucun fichier sélectionné'}</p>
          <p className="text-sm text-gray-500 mt-2 dark:text-darktext-primary">Assurez-vous que le fichier contient les champs requis</p>

          
        </form>
      )}
    </Cardata>
    </motion.div>
      {excelPreview.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold mb-2">Aperçu du fichier :</h4>
          <div className="overflow-x-auto mb-4">
            <table className="table-auto border w-full text-sm">
              <thead>
                <tr className="bg-gray-200">
                  {Object.keys(excelPreview[0]).map((key) => (
                    <th key={key} className="border px-2 py-1">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-50">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="border px-2 py-1">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mb-4 text-sm">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              « Précédent
            </button>
            <span>Page {currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Suivant »
            </button>
          </div>

          <MapContainer center={[excelPreview[0].latitude, excelPreview[0].longitude]} zoom={12} style={{ height: '400px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {excelPreview.map((p, i) => (
              <Marker key={i} position={[p.latitude, p.longitude]}>
                <Popup>{p.description}</Popup>

              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
