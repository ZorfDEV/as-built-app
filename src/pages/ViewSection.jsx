import  { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import DetailCard from '../components/ui/DetailCard'
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import ButtonContainer from "../components/ui/ButtonContainer";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ClusterMap from "../components/Map/ClusterMap";
import ButtonForm from "../components/ui/ButtonForm";

function ViewSections() {

   const {id} = useParams();
   const navigate = useNavigate();
   const [section, setsection] = useState([]); 
  const [points, setPoints] = useState([]);
  const [markers, setMarkers] = useState([]);
   const [loading, setLoading] = useState(true);
  const [checkpoint, setCheckpoint] = useState(true); // Assuming checkpoints is a boolean
   const token = localStorage.getItem('token');
   
   const headers = useMemo(() => ({
      Authorization: `Bearer ${token}`
   }), [token]);

  useEffect(() => {
    axios.get(`/api/sections/${id}`, { headers })
      .then(response => {
        setsection(response.data.section); 
        setPoints(response.data.points);
        setMarkers(response.data.marqueurs);
        setCheckpoint(true); // Assuming checkpoints is part of the response
        console.log('first point:',response.data.points[0]); 
        console.log('markers:', response.data.marqueurs);
        console.log('section:', response.data.section);
        console.log(checkpoint);
        setLoading(false);
      })
      .catch(error => {
        toast.error("Erreur lors du chargement des données");
        console.error("Erreur lors du chargement :", error);
        setLoading(false);
      });
  }, [id, headers, checkpoint]);

  const handleDelete = () => {
    axios.delete(`/api/sections/${id}`, { headers })
      .then(() => {
        toast.success("Section supprimé avec succès");
        navigate("/dashboard/list-sections");
      })
      .catch(error => {
        if (error?.response?.status === 403) {
          toast.error('Vous devez être administrateur pour supprimer une section');
        } else {
          toast.error("Erreur lors de la suppression de la section");
        }
        console.error("Erreur lors de la suppression :", error);
      });
  };

  const handleClick = () => {
        navigate(`/dashboard/section/edit/${id}`);
    };
    const details = [
      { label: 'Nom de la section', value: section.name },
      { label: 'Créé le', value: section.createdAt ? format(parseISO(section.createdAt), 'dd/MM/yy HH:mm', { locale: fr }) : 'Date non disponible' },
      { label: 'Description', value: section.description },
      
    ];
  
  if (loading) return <div>Chargement...</div>;
  if (!section) return <div>Section non trouvée</div>;
   
  return (
    <div className="p-6">
      <DetailCard
        title="Détails de la section"
        details={details}
        characteristics={<ButtonContainer>
        <ButtonForm onClick={handleClick} icon ={<MdOutlineModeEdit/>} variant="outline_success"/>
        <ButtonForm onClick={handleDelete} icon ={<MdDeleteSweep />} variant="outline_danger"/>
      </ButtonContainer>}
        children={<ClusterMap points={points} checkpoints={checkpoint} markers={markers} />}
      />
      
    </div>
  );
}

export default ViewSections;