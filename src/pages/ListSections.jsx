import { useEffect, useState,useCallback } from "react";
import axios from 'axios';
import TableData from './../components/ui/TableData'
import toast from 'react-hot-toast'; 
import { useNavigate } from "react-router-dom";
const ListSections = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const columns = [
    { key: '_id', title: 'ID' },
    { key: 'name', title: 'Nom' },
    { key: 'description', title: 'Détail' },
    { key: 'createdAt', title: 'Créé le:' },
  ];
    useEffect(() => {
        axios.get('/api/sections')
            .then(response => {
                setSections(response.data);
                setLoading(false);
                console.log(response.data);
            })
            .catch(err => {
                setError(err.message || 'Erreur lors du chargement');
                setLoading(false);
            });
    }, []);

     const formatDataForExport = () => {
    return sections.map(section => ({
      'ID': section._id,
      'Nom de zone': section.name,
      'Description': section.description,
      'Date de création': new Date(section.createdAt).toLocaleDateString('fr-FR')
      
    }));
  };
 const navigate = useNavigate();

 const [actionData, setActionData] = useState(null);
 
 const handleView = useCallback((id) => {
   setActionData({ type: 'view', id });
 }, []);

 const handleEdit = useCallback((id) => {
   setActionData({ type: 'edit', id });
 }, []);

  useEffect(() => {
    if (actionData) {
      switch (actionData.type) {
        case 'view':
          navigate(`/dashboard/section/view/${actionData.id}`);
          break;
        case 'edit':
          navigate(`/dashboard/section/edit/${actionData.id}`);
          break;
        default:
          break;
      }
      setActionData(null);
    }
  }, [actionData, navigate]);

 const handleDelete = async (id) => {
  const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
  
  if (!isConfirmed) {
    return;
  }
  try {
    // Afficher un indicateur de chargement si nécessaire
    setLoading(true);
    // Appel à l'API pour supprimer le produit
         axios.delete(`/api/section/${id}`).then(response => {
          setSections(response.data.sections);
          setLoading(false);
        })
    // eslint-disable-next-line no-undef
    if (response.status === 200) {
      // Mise à jour de la liste des produits après suppression
      setSections(sections.filter(section => section._id !== id));
      navigate(`/dashboard/list-sections`);
      toast.success('zone supprimé avec succès');
    }
  } catch (error) {
    // Gestion des erreurs
    console.error('Erreur lors de la suppression:', error);
    if (error.response?.status === 404) {
      toast.error('zone non trouvé');
    } else if (error.response?.status === 403) {
      toast.error('Vous n\'avez pas les droits pour effectuer cette action');
    } else {
      toast.error('Une erreur est survenue lors de la suppression');
    }
  } finally {
    // Désactiver l'indicateur de chargement
    setLoading(false);
  }
};

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div className='p-6'>
       <TableData data={sections} columns={columns} goto='/dashboard/add-section'
             handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete}
              formatDataForExport={formatDataForExport()}  fileNames='Sections'/>
        </div>
    );
};

export default ListSections;