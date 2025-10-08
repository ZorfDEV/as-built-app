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
import { convertDMSToDecimal } from './../utils/distance';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


export default function EditPoint() {
 
  const [sections, setSections] = useState([]);
  const [marqueurs, setMarqueurs] = useState([]);
  const[point, setPoint] = useState(null);
/*const [pointData,pointData] = useState({
    name: '',
    description: '',
    latitude: '',   
    longitude: '',
    section_id: '',
    marqueur_id: ''
  });   */ 
  const natures = [
    { _id: 'pt-asbuilt', name: 'Construction As-Built', id: 1 },
    { _id: 'incident', name: 'Incident', id: 2 },
    { _id: 'maintenance', name: 'Maintenance', id: 3 }
  ];
  const statuses = [
    { _id: 'active', name: 'Actif',id: 1 },
    { _id: 'inactive', name: 'Inactive',id: 2 },
    { _id: 'pending', name: 'En attente',id: 3 },
    { _id: 'archived', name: 'Terminé',id: 4 }
  ];
  const [loading, setLoading] = useState(true);
const { id } = useParams();
const navigate = useNavigate();
const token = localStorage.getItem('token');
const headers = useMemo(() => ({
        Authorization: `Bearer ${token}`
     }), [token]);

useEffect(() => {
 
    axios.get(`/api/points/${id}`, {headers})
      .then(response => {
        setPoint(response.data);
        console.log('view pt', response.data);
        setLoading(false);
      })
      .catch(error => {
        toast.error('Erreur lors du chargement du point');
        console.error(error);
        setLoading(false);
      });
  }, [id,headers]);

  useEffect(() => {
    axios.get('/api/sections',{headers}).then(res => {
      setSections(res.data);
      console.log('Sections:', res.data);
    });
    axios.get('/api/marqueurs',{headers}).then(res => {
      setMarqueurs(res.data);
      console.log('Marqueurs:', res.data);
    });
  }, [headers]);

const handleSubmitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const updatedData = {
      name: formData.get('name').trim() || point.name,
      description: formData.get('description').trim() || point.description,
      section_id: formData.get('section_id') || point.section_id._id,
      marqueur_id: formData.get('marqueur_id') || point.marqueur_id._id,
      latitude: point.latitude,
      longitude: point.longitude,
      nature: formData.get('nature') || point.nature,
      status: formData.get('status') || point.status,
      updatedAt: new Date().toISOString()
    };

    const latInput = formData.get('latitude').trim();
    const lngInput = formData.get('longitude').trim();

    if (latInput !== point.latitude.toString()) {
      try {
        updatedData.latitude = convertDMSToDecimal(latInput);
      } catch {
        console.log('Payload envoyé au backend :', updatedData);

        toast.error('Latitude invalide');
        return;
      }
    }

    if (lngInput !== point.longitude.toString()) {
      try {
        updatedData.longitude = convertDMSToDecimal(lngInput);
      } catch {
        console.log('Payload envoyé au backend :', updatedData);
        toast.error('Longitude invalide');
        return;
      }
    }

    try {
      await axios.put(`/api/points/${id}`, updatedData,{headers});
      toast.success('Point mis à jour avec succès');
      navigate('/dashboard/list-points');
    } catch (error) {
         if (error?.response?.status === 403) {
                toast.error('Vous devez être administrateur pour modifier un point');
                navigate('/dashboard/list-points');
            } else {
            toast.error("Erreur lors de la suppression du point");
            }
    }
  };


    if (loading) return <div>Chargement...</div>;

    return (
    <div className="p-6">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}>
      <Cardata title={'Modifier un point'}
        subtitle={ 'Formulaire de modification du point'}
        className="p-6 bg-white dark:bg-gray-800 shadow-md items-center w-full max-w-3xl mx-auto"> 
        <form onSubmit={handleSubmitForm} >

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-4">

          <Input name="name" defaultValue={point.name} label="name" required className='p-2 px-2'/> 
         
           </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 p-4">
          <Input name="latitude" defaultValue={point.latitude} label="latitude"  required className='p-2 px-2'/>
          <Input name="longitude" defaultValue={point.longitude} label="longitude"  required className='p-2 px-2'/>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 p-4">
          <InputSelect name="nature" defaultValue={point.nature} label="Nature"  required className='p-2 px-2'
            datas={natures} />
          <InputSelect name="status" defaultValue={point.status} label='Statut'  required className='p-2 px-2'
            datas={statuses} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 p-4">
          <InputSelect name="section_id" defaultValue={point.section_id._id} label="Section"  required className='p-2 px-2'
            datas={sections} />
          <InputSelect name="marqueur_id" defaultValue={point.marqueur_id._id} label='marqueur'  required className='p-2 px-2'
            datas={marqueurs} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-4">
          <Textarea name="description"  defaultValue={point.description} label="Description" required className='p-2 px-2' />
          </div>
          <ButtonContainer  align = 'right' className=" m-4">
        <ButtonForm
        type="button"
       onClick={() => navigate('/dashboard/list-points')}
     variant='secondary'
     className=" py-2" >
    Annuler
    </ButtonForm>
    <ButtonForm
     type="submit"
     variant='success'
     className=" py-2">
       Ajouter
      </ButtonForm>
        </ButtonContainer>
        </form>
        </Cardata>
        </motion.div>
    </div>
  );
}
