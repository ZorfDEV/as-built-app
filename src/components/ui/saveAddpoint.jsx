import { useEffect, useState } from 'react';
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

export default function AddPoint() {
  const [tab, setTab] = useState('form');
  const [sections, setSections] = useState([]);
  const [marqueurs, setMarqueurs] = useState([]);
  /*const [form, setForm] = useState({
    nom: '',
    latitude: '',
    longitude: '',
    description: '',
    nature: '',
    section_id: '',
    marqueur_id: ''
  });*/
  const [file, setFile] = useState(null);
  const [excelPreview, setExcelPreview] = useState([]);
  //const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    axios.get('http://localhost:5000/api/sections').then(res => {
      setSections(res.data);
      console.log('Sections:', res.data);
    });
    axios.get('http://localhost:5000/api/marqueurs').then(res => {
      setMarqueurs(res.data);
      console.log('Marqueurs:', res.data);
    });
  }, []);

  /*const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };*/
// Ajout de la fonction pour gérer la soumission du formulaire
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Option 1: Utiliser FormData directement
    console.log(Object.fromEntries(formData));
    
    // Option 2: Créer un objet avec les valeurs
    const pointData = {
      name: formData.get('name'),
      //nature: formData.get('nature'),
      longitude: formData.get('longitude'),
      description: formData.get('description'),
      latitude: formData.get('latitude'),
      section_id: formData.get('section_id'),
      marqueur_id: formData.get('marqueur_id')
    };

    try {
      await axios.post('http://localhost:5000/api/points', pointData);
      console.log('Point ajouté avec succès', pointData);
      toast.success('Point ajouté avec succès');
      //setSuccess('Point ajouté avec succès');
      e.target.reset(); // Réinitialiser le formulaire
    } catch {
      console.log('Erreur ajout point', pointData);
      toast.error('Erreur ajout point');
    }
  };

  // Fonction pour convertir les coordonnées DMS en décimales
  // DMS format: "N:45°30′15″, E:3°15′30″"
  // Example usage: convertDMS("N:45°30′15″, E:3°15′30″") returns { lat: 45.5041667, lng: 3.2583333 }
  const convertDMS = (dmsString) => {
    if (!dmsString) return null;
    const regex = /([NSWE]):(\d{1,3})[°:\s](\d{1,2})[′:\s](\d{1,2}(\.\d+)?)[″]?/gi;
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
        //alert(`Colonnes manquantes : ${missing.join(', ')}`);
        setExcelPreview([]);
        return;
      }

      const validated = raw.map((row) => {
        let lat = parseFloat(row.latitude);
        let lng = parseFloat(row.longitude);

        if (isNaN(lat) || isNaN(lng)) {
          const converted = convertDMS(`S:${row.latitude}, E:${row.longitude}`);
          if (!converted) return null;
          lat = converted.lat;
          lng = converted.lng;
        }

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
    toast.success('fichier effacer');
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('form')} className={tab === 'form' ? 'font-bold' : ''}>Saisie manuelle</button>
        <button onClick={() => setTab('upload')} className={tab === 'upload' ? 'font-bold' : ''}>Importer Excel</button>
      </div>
        <SwitchMode />
       </div>
      <Cardata title={tab === 'form' ? 'Ajouter un point' : 'Importer des points'}
        subtitle={tab === 'form' ? 'Formulaire d’ajout de point' : 'Importer des points depuis un fichier Excel'}
        className="p-6 bg-white dark:bg-gray-800 shadow-md items-center w-full max-w-3xl mx-auto"
        noPadding> 
      {tab === 'form' && (
        <form onSubmit={handleSubmitForm} >

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-6">

          <Input name="name" label="Nom" required className='p-2 px-2'/> 
         
           </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 p-6">
          <Input name="latitude" type="number" step="any" label="Latitude"  required className='p-2 px-2'/>
          <Input name="longitude" type="number" step="any" label="Longitude"   required className='p-2 px-2'/>
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
                            
                            className="bg-gray-400 text-white w-full py-2 rounded hover:bg-gray-600"
                          >
                            Annuler
                          </ButtonForm>
                          <ButtonForm
                            type="submit"
                            className="bg-green-700 text-white py-2 w-full transition duration-150 ease-in rounded hover:bg-green-600"
                          >
                            Ajouter
                          </ButtonForm>
                        </ButtonContainer>
        </form>
      )}

      {tab === 'upload' && (
        <form onSubmit={handleUploadExcel} className=" flex flex-col items-center">
          
          
          <div className="col-span-full">
             
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <MdAttachFile aria-hidden="true" className="mx-auto size-12 text-gray-300"/>
                  <div className="mt-4 flex text-sm/6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file"  accept=".xlsx" onChange={handleExcelRead} type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs/5 text-gray-600">xlsx, up to 10MB</p>
                </div>
              </div>
            </div>
        <ButtonContainer className="flex mt-6 w-full">
          {file && (
                          <ButtonForm
                            type="button"
                            
                            className="bg-gray-400 text-white w-full py-2 rounded hover:bg-red-500"
                          >
                            <span onClick={handleResetFile}>Supprimer</span>
                          </ButtonForm>
                           )}
                          <ButtonForm
                            type="submit"
                            className="bg-green-700 text-white py-2 w-[100px] transition duration-150 ease-in rounded hover:bg-green-600"
                          >
                            Importer
                          </ButtonForm>
                        </ButtonContainer>
          
          <p className="text-sm text-gray-500 mt-2">Fichier sélectionné : {file ? file.name : 'Aucun fichier sélectionné'}</p>
          <p className="text-sm text-gray-500 mt-2">Assurez-vous que le fichier contient les colonnes : nom, latitude, longitude, description, nature, section_id, marqueur_id</p>

          
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
