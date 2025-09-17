import React, { useState, useEffect, useMemo } from "react";
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

const ViewMarqueur = () => {
    const { id } = useParams();
  const [marqueur, setmarqueur] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    const token = localStorage.getItem('token');
          const headers = useMemo(() => ({
                  Authorization: `Bearer ${token}`
               }), [token]);

useEffect(() => {
    axios.get(`/api/marqueurs/${id}`,{headers})
      .then(response => {
        setmarqueur(response.data);
        console.log('view pt', response.data);
        setLoading(false);
      })
      .catch(error => {
        toast.error('Erreur lors du chargement du marqueur');
        console.error(error);
        setLoading(false);
      });
  }, [id,headers]);

   const details = [
    { label: 'Nom du marqueur', value: marqueur?.name },
    { label: 'Créé le', value: marqueur?.createdAt ? format(parseISO(marqueur.createdAt), 'dd/MM/yy HH:mm', { locale: fr }) : 'Date non disponible' },
    { label: 'Modifié le', value: marqueur?.updatedAt ? format(parseISO(marqueur.updatedAt), 'dd/MM/yy HH:mm', { locale: fr }) : 'Date non disponible' },
    { label: 'Fichier SVG', value: marqueur?.file ? <a href={`http://localhost:5000${marqueur.file}`} target="_blank" rel="noopener noreferrer">Voir le fichier</a> : 'Aucun fichier associé' },
    ];

    const handleDelete = () => {
    const confirm = window.confirm(`Êtes-vous sûr de vouloir supprimer le marqueur ${marqueur.name} ?`);
    if (!confirm) return;
    setLoading(true);
    axios.delete(`/api/marqueurs/${id}`,{headers})
        .then(() => {
            toast.success("marqueur supprimé avec succès");
            navigate("/dashboard/list-marqueurs");
        })
         .catch(error => {
            if (error?.response?.status === 403) {
                toast.error('Vous devez être administrateur pour supprimer un marqueur');
            } else {
            toast.error("Erreur lors de la suppression du marqueur");
            }
            console.error("Erreur lors de la suppression :", error);
            setLoading(false);
        });
    };

  if (loading) return <div>Chargement...</div>;
  if (!marqueur) return <div>marqueur non trouvé</div>;

  return (
    <div className="p-6">
      <DetailCard 
      details={details} 
      title="Détails du marqueur"
              characteristics={<ButtonContainer>
              <ButtonForm onClick={() => navigate(`/dashboard/marqueur/edit/${id}`)} icon={<MdOutlineModeEdit />} variant="outline_success"/>
              <ButtonForm onClick={handleDelete} icon ={<MdDeleteSweep />} variant="outline_danger"/>
            </ButtonContainer>}
              children={<img src={`http://localhost:5000${marqueur.file}`} className="w-4 md:w-8 max-w-full max-h-full" alt="marqueur"/>}
            />
      
    </div>
  );
}   
export default ViewMarqueur;
