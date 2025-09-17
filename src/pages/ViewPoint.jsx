import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DetailCard from "../components/ui/DetailCard";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import ButtonContainer from "../components/ui/ButtonContainer";
import ButtonForm from "../components/ui/ButtonForm";
import { MdDeleteSweep } from "react-icons/md";
import { MdOutlineModeEdit } from "react-icons/md";
import ClusterMap from "../components/Map/ClusterMap";
import { useParams } from "react-router-dom";

const ViewPoint = () => {
    const { id } = useParams();
  const [point, setPoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
   const token = localStorage.getItem('token');

useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    axios.get(`/api/points/${id}`, { headers })
      .then(response => {
        setPoint(response.data);
        console.log('view pt', response.data);
        console.log('view pt length',Object.values( response.data).length);
        setLoading(false);
      })
      .catch(error => {
        toast.error('Erreur lors du chargement du point');
        console.error(error);
        setLoading(false);
      });
  }, [id, token]);

   const details = [
    { label: 'Nom du point', value: point?.name },
    { label: 'Longitude', value: point?.longitude },
    { label: 'Latitude', value: point?.latitude },
    { label: 'Description', value: point?.description },
    { label: 'Créé le', value: point?.createdAt ? format(parseISO(point.createdAt), 'dd/MM/yy HH:mm', { locale: fr }) : 'Date non disponible' },
    { label: 'Section', value: point?.section_id ? point.section_id.name : 'Aucune section' }
    ];

    const handleDelete = () => {
    const confirm = window.confirm(`Êtes-vous sûr de vouloir supprimer le point ${point.name} ?`);
    if (!confirm) return;
    setLoading(true);
    const headers = {
      Authorization: `Bearer ${token}`
    };
    axios.delete(`/api/points/${id}` , { headers })
        .then(() => {
            toast.success("Point supprimé avec succès");
            navigate("/dashboard/list-points");
        })
        .catch(error => {
            if (error?.response?.status === 403) {
                toast.error('Vous devez être administrateur pour supprimer un point');
            } else {
            toast.error("Erreur lors de la suppression du point");
            }
            console.error("Erreur lors de la suppression :", error);
            setLoading(false);
        });
    };

  if (loading) return <div>Chargement...</div>;
  if (!point) return <div>Point non trouvé</div>;

  return (
    <div className="p-6">
      <DetailCard 
      details={details} 
      title="Détails du point"
              characteristics={<ButtonContainer>
              <ButtonForm onClick={() => navigate(`/dashboard/point/edit/${id}`)} icon={<MdOutlineModeEdit />} variant="outline_success"/>
              <ButtonForm onClick={handleDelete} icon ={<MdDeleteSweep />} variant="outline_danger"/>
            </ButtonContainer>}
              children={<ClusterMap points={point} checkpoints={false} />}
            />
      
    </div>
  );
}   
export default ViewPoint;
